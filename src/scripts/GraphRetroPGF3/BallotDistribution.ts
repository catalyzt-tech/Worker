import retropgf3 from '../../../data/rpgf3-merge-final.json'
import fs from 'fs'
import path from 'path'
const run = () => {
  const data = retropgf3 as any[]
  const convertData = new Array(110).fill(0)
  for (let index = 0; index < data.length; index++) {
    const ballot = data[index]['ballot']
    convertData[ballot]++
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../../..//data/ballotDistribution.json'),
    JSON.stringify(convertData, null, 2)
  )
}
run()
export { run }
