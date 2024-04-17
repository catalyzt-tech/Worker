import retropgf3 from '../../../data/rpgf3-merge-final.json'
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
const run = () => {
  const rawData = retropgf3 as any[]

  let opStack = rawData
    .filter((item) => item['New Main-Category'] == 'OP_Stack')
    .map((item) => item['ballot'])
    .sort((a, b) => a - b)
  let developerEcosystem = rawData
    .filter((item) => item['New Main-Category'] == 'Developer_Ecosystem')
    .map((item) => item['ballot'])
    .sort((a, b) => a - b)
  let collectiveGovernance = rawData
    .filter((item) => item['New Main-Category'] == 'Collective_Governance')
    .map((item) => item['ballot'])
    .sort((a, b) => a - b)
  let endUserExperience = rawData
    .filter(
      (item) => item['New Main-Category'] == 'End_User_Experience_Adoption'
    )
    .map((item) => item['ballot'])
    .sort((a, b) => a - b)
  console.log(
    opStack,
    developerEcosystem,
    collectiveGovernance,
    endUserExperience
  )

  const finalOpStack = [
    opStack[0],
    average(opStack),
    median(opStack),
    opStack[opStack.length - 1],
  ]
  const finalDeveloperEcosystem = [
    developerEcosystem[0],
    average(developerEcosystem),
    median(developerEcosystem),
    developerEcosystem[developerEcosystem.length - 1],
  ]
  const finalCollectiveGovernance = [
    collectiveGovernance[0],
    average(collectiveGovernance),
    median(collectiveGovernance),
    collectiveGovernance[collectiveGovernance.length - 1],
  ]
  const finalEndUserExperience = [
    endUserExperience[0],
    average(endUserExperience),
    median(endUserExperience),
    endUserExperience[endUserExperience.length - 1],
  ]
  const finalData = {
    opStack: finalOpStack,
    developerEcosystem: finalDeveloperEcosystem,
    collectiveGovernance: finalCollectiveGovernance,
    endUserExperience: finalEndUserExperience,
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../../../data/ballotEachCategory.json'),
    JSON.stringify(finalData, null, 2)
  )
  // console.log(opStack.length + developerEcosystem.length + collectiveGovernance.length + endUserExperience.length)
}
run()
export { run }
