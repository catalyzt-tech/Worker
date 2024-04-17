import data from '../../../data/rpgf3-merge-final.json'
import fs from 'fs'
import path from 'path'

interface DataItem {
  displayName: string
  scaled: string
}

interface MappedItem {
  projectName: string
  amount: string
}

const run = () => {
  const rawData: DataItem[] = data
  const newData: MappedItem[] = rawData
    .filter((item: any) => item['Approved'] == true)
    .map((item: DataItem) => {
      return {
        projectName: item.displayName,
        amount: Number(item.scaled).toFixed(2),
      }
    })
    .sort((a: MappedItem, b: MappedItem) => Number(b.amount) - Number(a.amount))
  //   console.log(newData)
  fs.writeFileSync(
    path.resolve(__dirname, '../../../data/allocationDistribution.json'),
    JSON.stringify(newData, null, 2)
  )
}

run()
export { run }
