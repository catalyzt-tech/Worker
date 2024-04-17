import rawData from '../../../data/rpgf2-merge-final.json'
import fs from 'fs'
import path from 'path'

const covertStringToNumber = (str: string) => {
  return Number(str.replace(/[^0-9.-]+/g, ''))
}

const average = (arr: number[]) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

const median = (arr: number[]) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b)
  return arr.length % 2 !== 0
    ? Number(nums[mid])
    : Number((nums[mid - 1] + nums[mid]) / 2)
}

const run = () => {
  const data = rawData as any[]
  const allocation = data
    .map((item) => {
      // console.log(item)
      return {
        projectName: item.name,
        amount: covertStringToNumber(item['OP Received']),
      }
    })
    .sort((a, b) => b.amount - a.amount)
  const amount = allocation.map((item) =>
    covertStringToNumber(item.amount.toFixed(2))
  )
  console.log('Max:', amount[0])
  console.log('Average:', average(amount).toFixed(2))
  console.log('Median:', median(amount))
  console.log('Min:', amount[amount.length - 1])
  // console.log(allocation)
  fs.writeFileSync(
    __dirname + '/../../../data/RetroPGF2/allocationDistribution.json',
    JSON.stringify(allocation, null, 2)
  )
}

run()
export { run }
