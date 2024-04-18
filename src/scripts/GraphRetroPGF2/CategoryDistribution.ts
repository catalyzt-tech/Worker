import rawData from '../../../data/rpgf2-merge-final.json'
import fs from 'fs'
import path from 'path'
const run = () => {
  let educationCount = 0
  let infrastructureCount = 0
  let toolingCount = 0
  const data = rawData as any[]
  for (const item of data) {
    if (item['Category'] === 'Education') {
      educationCount++
    }
    if (item['Category'] === 'Infrastructure') {
      infrastructureCount++
    }
    if (item['Category'] === 'Tooling and utilities') {
      toolingCount++
    }
  }
  //   console.log('Education:', educationCount)
  //   console.log('Infrastructure:', infrastructureCount)
  //   console.log('Tooling and utilities:', toolingCount)
  fs.writeFileSync(
    __dirname + '/../../../data/RetroPGF2/categoryDistribution.json',
    JSON.stringify(
      {
        Education: educationCount,
        Infrastructure: infrastructureCount,
        'Tooling and utilities': toolingCount,
      },
      null,
      2
    )
  )
}
run()
export { run }
