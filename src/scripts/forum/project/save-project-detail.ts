import axios from 'axios'
import {
  Answer,
  GetProjectDetailExample,
  Post,
  ProjectJSON,
} from './projectType'
import { HTTPSTATUSOK } from '../../../../const'
import { htmlToText } from 'html-to-text'
import * as fs from 'fs'
import * as path from 'path'
import { convertSpecialChar } from '../../../../utils/utils'


// SaveProjectData: Save all the project data into /data/forum-data using urls from GetAllProjectsUrl
export async function SaveProjectData(urls: string[], requiredPath: string[] = []) {
  const folderName = path.join(__dirname, ...requiredPath)

  // Ensure the folder exists
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true })
  }

  for (const url of urls) {
    try {
      const response = await axios.get<GetProjectDetailExample>(url)
      if (response.status !== HTTPSTATUSOK && !response.data.post_stream.posts) {
        console.error(`Error fetching data ${url}`)
        continue
      }

      let posts = response.data.post_stream.posts
      const projectData = response.data
      if (posts.length !== 0) {
        let postOwner: Post = posts[0]

        // store the owner of the post data
        let projectOwner: ProjectJSON = {
          title: projectData.title,
          content: htmlToText(postOwner.cooked),
          views: projectData.views,
          like_count: projectData.like_count,
          word_count: projectData.word_count,
          answer: [],
          created_at: projectData.created_at,
        }

        // console.log(`Saving project data for ${projectData.title}`)

        // slice out the owner post data
        posts = posts.slice(1, posts.length)

        // sort trust level
        posts.sort((a, b) => {
          const actionCountA = (
            a.actions_summary.find((action) => action.id === 2) || { count: 0 }
          ).count
          const actionCountB = (
            b.actions_summary.find((action) => action.id === 2) || { count: 0 }
          ).count

          if (actionCountA !== actionCountB) {
            return actionCountB - actionCountA
          }

          return b.trust_level - a.trust_level
        })

        for (const post of posts) {
          if (projectOwner.answer.length === 5) {
            break
          }

          if (post.cooked !== '') {
            let ans: Answer = {
              content: htmlToText(post.cooked),
              created_at: post.created_at,
              trust_level: post.trust_level,
              username: post.username,
              admin: post.admin,
              moderator: post.moderator,
              staff: post.staff,
              like_count:
                // action.id === 2 -> like
                post.actions_summary.find((action) => action.id === 2)?.count ||
                0,
            }
            projectOwner.answer.push(ans)
          }
        }

        // remove unnecessary string
        let newUrl = url.replace('.json?forceLoad=true', '') + '.txt'
        const fileName = convertSpecialChar(newUrl)
        const filePath = path.join(folderName, fileName)

        // Write the project data to a JSON file
        fs.writeFileSync(
          filePath,
          JSON.stringify(projectOwner, null, 2),
          'utf-8'
        )
      }
    } catch (error) {
      console.error(`Error fetching data ${url}:`, error)
    }
  }
}
