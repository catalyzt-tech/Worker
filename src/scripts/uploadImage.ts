import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import data from '../../static/retroPGF3-dataset/resultData.json'
import fs from 'fs'

dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const run = async () => {
  let newDataset: any[] = []
  let iconPath: string = '',
    bannerPath: string = ''
  const imageType = ['png', 'jpg', 'jpeg']
  const processUpload = async () => {
    for (const [index, project] of data.entries()) {
      const address = project['metadataPtr'].slice(60, 102)
      console.log(address)
      console.log(index, project['displayName'])
      //Icon image
      for (const type of imageType) {
        const urlIcon = `https://content.optimism.io/profile/v0/profile-image/10/${address}.${type}`
        const response = await fetch(urlIcon)
        if (response.status === 200) {
          // console.log(urlIcon)
          cloudinary.uploader.upload(
            urlIcon,
            {
              public_id: `retropgf3/${project['displayName']}_icon`,
              use_filename: true,
            },
            // {
            //   folder: 'retropgf3',
            //   use_filename: true,
            //   unique_filename: false,
            //   overwrite: true,
            //   invalidate: true,
            //   resource_type: 'image',
            // },
            function (error, result) {
              console.log(result)
              if (result) {
                iconPath = result.url
              }
            }
          )
          break
        } else {
          iconPath = ''
        }
      }
      //Banner Image
      for (const type of imageType) {
        const urlBanner = `https://content.optimism.io/profile/v0/banner-image/10/${address}.${type}`
        const response = await fetch(urlBanner)
        if (response.status === 200) {
          console.log(urlBanner)
          cloudinary.uploader.upload(
            urlBanner,
            {
              public_id: `retropgf3/${project['displayName']}_banner`,
              use_filename: true,
            },
            // {
            //   folder: 'retropgf3',
            //   use_filename: true,
            //   unique_filename: false,
            //   overwrite: true,
            //   invalidate: true,
            //   resource_type: 'image',
            // },
            function (error, result) {
              console.log(result)
              // console.log(error)
              if (result) {
                bannerPath = result.url
              }
            }
          )
          break
        } else {
          bannerPath = ''
        }
      }
      //Update data
      // data[index] = await {
      //   ...project,
      //   iconPath: iconPath,
      //   bannerPath: bannerPath,
      // }
      await newDataset.push({
        ...project,
        iconPath: iconPath,
        bannerPath: bannerPath,
      })
    }
    return newDataset
  }
  const finalData = await processUpload()
  fs.writeFileSync(
    '/data/rpgf3(image).json',
    JSON.stringify(finalData, null, 2)
  )
  return finalData
}

run()
export { run }
