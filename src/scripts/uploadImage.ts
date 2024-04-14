import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import data from '../../static/retroPGF3-dataset/resultData.json'
import fs from 'fs'
import path from 'path'

dotenv.config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

function cleanName(name: string) {
  return name.replace(/[^a-zA-Z0-9_ ]/g, '').replace(/ /g, '_')
}

const run = async () => {
  let newDataset: any[] = []
  let iconPath: string = '',
    bannerPath: string = ''
  const imageType = ['png', 'jpg', 'jpeg']
  const processUpload = async () => {
    //0-500, 501
    for (let index = 1500; index < data.length; index++) {
      const address = data[index]['metadataPtr'].slice(60, 102)
      console.log(address)
      console.log(index, data[index]['displayName'])
      //Icon image
      for (const type of imageType) {
        const urlIcon = `https://content.optimism.io/profile/v0/profile-image/10/${address}.${type}`
        try {
          const response = await fetch(urlIcon)
          if (response.status === 200) {
            try {
              await cloudinary.uploader.upload(
                urlIcon,
                {
                  public_id: `retropgf3/${cleanName(
                    data[index]['displayName']
                  )}_icon`,
                  use_filename: true,
                },
                function (error, result) {
                  if (error) throw error
                  if (result) {
                    console.log(result)
                    iconPath = result.url
                  }
                }
              )
            } catch (error) {
              console.error('Failed to upload icon:', error)
            }
            break
          } else {
            iconPath = ''
          }
        } catch (error) {
          console.error('Failed to fetch icon:', error)
        }
      }
      //Banner Image
      for (const type of imageType) {
        const urlBanner = `https://content.optimism.io/profile/v0/banner-image/10/${address}.${type}`
        try {
          const response = await fetch(urlBanner)
          if (response.status === 200) {
            try {
              await cloudinary.uploader.upload(
                urlBanner,
                {
                  public_id: `retropgf3/${cleanName(
                    data[index]['displayName']
                  )}_banner`,
                  use_filename: true,
                },
                function (error, result) {
                  if (error) throw error
                  if (result) {
                    console.log(result)
                    bannerPath = result.url
                  }
                }
              )
            } catch (error) {
              console.error('Failed to upload banner:', error)
            }
            break
          } else {
            bannerPath = ''
          }
        } catch (error) {
          console.error('Failed to fetch banner:', error)
        }
      }
      //Update data
      // data[index] = await {
      //   ...project,
      //   iconPath: iconPath,
      //   bannerPath: bannerPath,
      // }
      await newDataset.push({
        ...data[index],
        iconPath: iconPath,
        bannerPath: bannerPath,
      })
    }
    const dir = path.resolve(__dirname, '../../data')
    await fs.mkdirSync(dir, { recursive: true })

    // Write the file
    const filePath = path.join(dir, 'rpgf3(image4).json')
    await fs.writeFileSync(filePath, JSON.stringify(newDataset, null, 2))

    return newDataset
  }
  const finalData = await processUpload()
  // fs.writeFileSync(
  //   '../../data/rpgf3(image1).json',
  //   JSON.stringify(finalData, null, 2)
  // )

  return finalData
}

run()
export { run }
