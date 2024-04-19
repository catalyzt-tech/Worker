import rawData from '../../../data/rpgf2-merge-final.json'
import fs from 'fs'

function stringToNumber(str: string) {
  return Number(str.replace(/[^0-9.-]+/g, ''))
}
const run = () => {
  const data = rawData as any[]
  const Educaiton = data
    .filter((item) => item['Category'] === 'Education')
    .map((item) => {
      return {
        projectName: item.name,
        amount: stringToNumber(item['OP Received']),
      }
    })
    .sort((a, b) => b.amount - a.amount)
  const Infrastructure = data
    .filter((item) => item['Category'] === 'Infrastructure')
    .map((item) => {
      return {
        projectName: item.name,
        amount: stringToNumber(item['OP Received']),
      }
    })
    .sort((a, b) => b.amount - a.amount)
  const Tooling = data
    .filter((item) => item['Category'] === 'Tooling and utilities')
    .map((item) => {
      return {
        projectName: item.name,
        amount: stringToNumber(item['OP Received']),
      }
    })
    .sort((a, b) => b.amount - a.amount)
  //   console.log('Education:', Educaiton)
  //   console.log('Infrastructure:', Infrastructure)
  //   console.log('Tooling:', Tooling)
  fs.writeFileSync(
    __dirname +
      '/../../../data/RetroPGF2/allocationDistributionEachCategory.json',
    JSON.stringify({ Educaiton, Infrastructure, Tooling }, null, 2)
  )
}
run()
export { run }
