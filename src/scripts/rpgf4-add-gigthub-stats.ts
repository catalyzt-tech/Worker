// import getGithubRepoStats from '../../data/RetroPGF4/osoResource/githubRepoStatsOSO (old).json'
import getGithubRepoStats from '../../data/RetroPGF4/osoResource/gitHubStats(officialOP).json'
import getRpgf4 from '../../data/RetroPGF4/(4)rpgf4_merged_application_review_appeal.json'
import fs from 'fs'

interface GitHubStats {
  application_id: string
  project_name: string
  url: string
  has_contracts: string
  is_fork: string
  fork_count: number
  star_count: number
  first_commit_time: string
  last_commit_time: string
  days_with_commits_count: number
  commit_count: number
  language: string
  repo_activity_check: string
  license_check: string
  license_spdx_id: string
  Custom_license_check: string
  repo_older_than_01_05: string
  Overall: string
  comment: string
}
const run = async () => {
  let count = 0
  await Promise.all(
    getRpgf4.map(async (project) => {
      for (let k = 0; k < project.github.length; k++) {
        const githubStat = getGithubRepoStats.find(
          (stat) => stat.url.toLowerCase() === project.github[k].toLowerCase()
        )
        if (githubStat) {
          count++
          const addGithubStats = {
            githubLink: project.github[k],
            star: githubStat.star_count !== '' ? githubStat.star_count : null,
            // watcher: githubStat.watcher_count,
            fork: githubStat.fork_count !== '' ? githubStat.fork_count : null,
            isFork: githubStat.is_fork !== '' ? githubStat.is_fork : null,
            openSourceResult:
              githubStat.Overall !== '' ? githubStat.Overall : null,
            openSourceRejectComment:
              githubStat.comment !== '' ? githubStat.comment : null,
          }
          project.github[k] = addGithubStats as any
          console.log('Updated project:', project.name, project.github[k])
        } else {
          const addGithubStats = {
            githubLink: project.github[k],
            star: null,
            // watcher: null,
            fork: null,
            isFork: null,
            openSourceResult: null,
            openSourceRejectComment: null,
          }
          project.github[k] = addGithubStats as any
          console.log('Updated project null:', project.name, project.github[k])
        }
      }
    })
  )
  console.log('All projects have been updated.', count)
}

const final = async () => {
  await run()
  console.log('Writing to file...')
  fs.writeFileSync(
    './data/RetroPGF4/(5)rpgf4_merged_githubstats.json',
    JSON.stringify(getRpgf4, null, 2)
  )
  console.log('File has been written.')
}

final()
export { run }
