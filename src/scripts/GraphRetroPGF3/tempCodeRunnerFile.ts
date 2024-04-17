import data from '../../../data/rpgf3-merge-final.json'
const run = () => {
  const rawData = data
  const newData = rawData
    .map((item) => {
      return {
        projectName: item['displayName'],
        amount: Number(item['scaled']).toFixed(2),
      }
    })
    .sort((a, b) => b.amount - a.amount)
  console.log(newData)
}

run()
export { run }
