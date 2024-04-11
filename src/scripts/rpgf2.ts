import fs from 'fs'
const rpgf2 = require('/Users/billy191/Desktop/Billy191/Worker/static/retroPGF2-dataset/results.json')
let total: any[] = []
const run = async () => {
  const folder = fs.readdirSync('static/retroPGF2-dataset/each_project')
  for (const subfolder of folder) {
    const files = fs.readdirSync(
      `static/retroPGF2-dataset/each_project/${subfolder}`
    )
    for (const file of files) {
      if (file === 'info.json') {
        const data = fs.readFileSync(
          `static/retroPGF2-dataset/each_project/${subfolder}/${file}`,
          'utf-8'
        )
        // console.log(data)
        const json = JSON.parse(data)
        total.push(json)
      }
    }
  }

  async function processProjects() {
    for (const project of rpgf2) {
      for (const info of total) {
        if (project['Project Name'] === info['name']) {
          const index = total.indexOf(info)
          const {
            Category,
            '% of votes received': votesReceived,
            ...rest
          } = project
          total[index] = {
            ...info,
            Category: Category,
            Vote_Recieved: votesReceived,
            ...rest,
          }
        }
      }
    }
    return total
  }

  const result = processProjects()
  // console.log(result)

  return result
}

// run()
export { run }
