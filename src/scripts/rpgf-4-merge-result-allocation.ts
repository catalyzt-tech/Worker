import data from '../../data/RetroPGF4/(7)rpgf4_merged_with_license_source.json'
import allocation from '../../data/RetroPGF4/optimismResource/rpgf4_allocation.json'
import fs from 'fs'
const run = () => {
  let count = 0
  for (let i = 0; i < data.length; i++) {
    let flagFound = false
    for (let j = 0; j < allocation.length; j++) {
      if (data[i].projectId === allocation[j]['Project_id']) {
        count++
        flagFound = true
        const newData = {
          ...data[i],
          reward: allocation[j]['rf4_allocation'],
        }
        data[i] = newData
      }
    }
    if (!flagFound) {
      const newData = {
        ...data[i],
        reward: 0,
      }
      data[i] = newData
    }
  }
  console.log('count', count)
  fs.writeFileSync(
    './data/RetroPGF4/(8)rpgf4_merged_allocation.json',
    JSON.stringify(data, null, 2)
  )
}

run()
