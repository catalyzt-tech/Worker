import rawData from '../../../data/rpgf2-merge-final.json'
import fs from 'fs'
import path from 'path'
function stringToNumber(str: string) {
  return Number(str.replace(/[^0-9.-]+/g, ''))
}
const run = () => {
  const data = rawData as any[]
  const educationSumAllocation = data
    .map((item) => {
      if (item['Category'] === 'Education') {
        return stringToNumber(item['OP Received'])
      }
      return 0
    })
    .reduce((a, b) => a + b, 0)
  const infrastructureSumAllocation = data
    .map((item) => {
      if (item['Category'] === 'Infrastructure') {
        return stringToNumber(item['OP Received'])
      }
      return 0
    })
    .reduce((a, b) => a + b, 0)

  const toolingSumAllocation = data
    .map((item) => {
      if (item['Category'] === 'Tooling and utilities') {
        return stringToNumber(item['OP Received'])
      }
      return 0
    })
    .reduce((a, b) => a + b, 0)
  //   console.log('Education:', educationSumAllocation)
  //   console.log('Infrastructure:', infrastructureSumAllocation)
  //   console.log('Tooling and utilities:', toolingSumAllocation)
  fs.writeFileSync(
    __dirname + '/../../../data/RetroPGF2/allocationEachCategory.json',
    JSON.stringify(
      {
        Education: educationSumAllocation,
        Infrastructure: infrastructureSumAllocation,
        'Tooling and utilities': toolingSumAllocation,
      },
      null,
      2
    )
  )
}
run()
export { run }
