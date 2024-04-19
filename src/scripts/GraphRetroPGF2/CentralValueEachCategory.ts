import e from 'express'
import retropgf2 from '../../../data/rpgf2-merge-final.json'
import fs from 'fs'
import path from 'path'

const median = (arr: number[]) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
}

const average = (arr: number[]) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

const stringToNumber = (str: string) => {
  return parseInt(str.replace(/,/g, ''))
}
const run = () => {
  const education = retropgf2
    .filter((item) => item['Category'] == 'Education')
    // .map((item) => {
    //   return {
    //     projectName: item['Project Name'],
    //     amount: stringToNumber(item['OP Received']),
    //   }
    // })
    .map((item) => stringToNumber(item['OP Received']))
    .sort((a, b) => b - a)
  const infrastructure = retropgf2
    .filter((item) => item['Category'] == 'Infrastructure')
    .map((item) => stringToNumber(item['OP Received']))
    .sort((a, b) => b - a)
  const tooling = retropgf2
    .filter((item) => item['Category'] == 'Tooling and utilities')
    .map((item) => stringToNumber(item['OP Received']))
    .sort((a, b) => b - a)

  const finalData = {
    education: [
      education[education.length - 1],
      average(education),
      median(education),
      education[0],
    ],
    infrastructure: [
      infrastructure[infrastructure.length - 1],
      average(infrastructure),
      median(infrastructure),
      infrastructure[0],
    ],
    tooling: [
      tooling[tooling.length - 1],
      average(tooling),
      median(tooling),
      tooling[0],
    ],
  }
  console.log(finalData)
  fs.writeFileSync(
    path.resolve(
      __dirname,
      '../../../data/RetroPGF2/CentralValueEachCategory.json'
    ),
    JSON.stringify(finalData, null, 2)
  )
}
run()
export { run }
