import getGithubRepoStats from '../../data/RetroPGF4/githubRepoStatsOSO.json'
import getRpgf4 from '../../data/RetroPGF4/rpgf4_merged_appeal.json'
import fs from 'fs'

const run = async () => {
  await Promise.all(
    getRpgf4.map(async (project) => {
      for (let k = 0; k < project.github.length; k++) {
        const githubStat = getGithubRepoStats.find(
          (stat) => stat.url.toLowerCase() === project.github[k].toLowerCase()
        )

        if (githubStat) {
          const addGithubStats = {
            githubLink: project.github[k],
            star: githubStat.star_count !== '' ? githubStat.star_count : null,
            // watcher: githubStat.watcher_count,
            fork: githubStat.fork_count !== '' ? githubStat.fork_count : null,
            isFork: githubStat.is_fork !== '' ? githubStat.is_fork : null,
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
          }
          project.github[k] = addGithubStats as any
          console.log('Updated project null:', project.name, project.github[k])
        }
      }
    })
  )
  console.log('All projects have been updated.')
}

const final = async () => {
  await run()
  console.log('Writing to file...')
  fs.writeFileSync(
    './data/RetroPGF4/rpgf4_merged_githubstats.json',
    JSON.stringify(getRpgf4, null, 2)
  )
  console.log('File has been written.')
}

final()
export { run }
