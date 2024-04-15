import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import data from '../../data/rpgf2.json'

dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

interface ProjectType {
  name: string
  twitter: string
  github: string
  website: string
  about: string
  question_1: string
  question_2: string
  team: string
  'OP Allocation': string
  Category: string
  Vote_Recieved: string
  'Project Name': string
  'OP Received': string
  'Project Profile': string
}

function cleanName(name: string) {
  return name.replace(/[^a-zA-Z0-9_ ]/g, '').replace(/ /g, '_')
}
const run = async () => {
  let newDataset: any[] = []
  for (let i = 0; i < data.length; i++) {
    const projectData = data[i] as ProjectType
    const pathFolder = path.resolve(
      __dirname,
      `../../static/retroPGF2-dataset/each_project/${projectData['name']}`
    )
    const targetFolder = fs.readdirSync(pathFolder)
    let iconPath: string = '',
      bannerPath: string = ''
    console.log(i, projectData['name'])
    for (const file of targetFolder) {
      //   console.log(file)
      const iconTarget = path.resolve(pathFolder, file)
      if (
        file.includes('icon.png') ||
        file.includes('icon.jpg') ||
        file.includes('icon.jpeg')
      ) {
        console.log(iconTarget)
        await cloudinary.uploader.upload(
          iconTarget,
          {
            public_id: `retropgf2/${cleanName(
              projectData['Project Name']
            )}_icon`,
            use_filename: true,
          },
          function (error, result) {
            if (error) {
              console.error('Failed to upload icon:', error)
            }
            if (result) {
              console.log(result)
              iconPath = result.url
            }
          }
        )
      }
      if (
        file.includes('banner.png') ||
        file.includes('banner.jpg') ||
        file.includes('banner.jpeg')
      ) {
        console.log(iconTarget)
        await cloudinary.uploader.upload(
          iconTarget,
          {
            public_id: `retropgf2/${cleanName(
              projectData['Project Name']
            )}_banner`,
            use_filename: true,
          },
          function (error, result) {
            if (error) {
              console.error('Failed to upload banner:', error)
            }
            if (result) {
              console.log(result)
              bannerPath = result.url
            }
          }
        )
      }

      //   console.log(iconTarget)
    }
    newDataset.push({
      ...projectData,
      iconPath: iconPath,
      bannerPath: bannerPath,
    })
    // console.log(targetFolder)
  }
  const dir = path.resolve(__dirname, '../../data')
  await fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, 'rpgf2-merge-final.json')
  await fs.writeFileSync(filePath, JSON.stringify(newDataset, null, 2))
}

run()
export { run }
