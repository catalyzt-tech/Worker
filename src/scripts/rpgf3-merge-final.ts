import data1 from '../../data/rpgf3(image1).json'
import data2 from '../../data/rpgf3(image2).json'
import data3 from '../../data/rpgf3(image3).json'
import data4 from '../../data/rpgf3(image4).json'
import fs from 'fs'
import path from 'path'

const data = [...data1, ...data2, ...data3, ...data4]
const dir = path.resolve(__dirname, '../../data')
fs.mkdirSync(dir, { recursive: true })

fs.writeFileSync(
  path.join(dir, 'rpgf3-merge-final.json'),
  JSON.stringify(data, null, 2)
)
