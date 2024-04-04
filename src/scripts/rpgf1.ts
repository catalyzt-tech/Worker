import fs from 'fs'

const run = () => {
  const data = fs.readFileSync(
    'static/retroPGF1-dataset/results_rpgf1.json',
    'utf-8'
  )
  const json = JSON.parse(data)
  console.log(json)
  return json
}

export { run }
