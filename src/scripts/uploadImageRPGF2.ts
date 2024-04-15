import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import data from '../../static/retroPGF2-dataset/results.json'

dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

interface ProjectType {
  'Project Name': string
  Category: string
  '% of votes received': string
  'OP Received': string
  'Project Profile': string
}

const run = () => {
  for (const project of data) {
    const projectData = project as ProjectType
    const pathFolder = path.resolve(
      __dirname,
      `../../static/retroPGF2-dataset/each_project/${projectData['Project Name']}`
    )
    const targetFolder = fs.readdirSync(pathFolder)
    for (const file of targetFolder) {
      console.log(file)
    }
    // console.log(targetFolder)
  }
}

run()
export { run }
