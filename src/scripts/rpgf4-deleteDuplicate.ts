import fs from 'fs'
import rawRPGF4_format from '../../data/RetroPGF4/Metadata_uncheckDuplicate.json'

const run = async () => {
  const nonDuplicateData: any[] = []

  const removeDup = () => {
    for (let i = 0; i < rawRPGF4_format.length; i++) {
      const data = rawRPGF4_format[i]
      let isDuplicate = false

      for (let j = 0; j < nonDuplicateData.length; j++) {
        if (
          nonDuplicateData[j].metadataUrl === data.metadataUrl ||
          !data.metadataUrl.includes('https://storage.retrofunding.optimism.io')
        ) {
          isDuplicate = true
          break
        }
      }

      if (!isDuplicate) {
        nonDuplicateData.push(data)
      }
    }
  }

  removeDup()
  console.log('nonDuplicateData', nonDuplicateData.length)
  fs.writeFileSync(
    './data/RetroPGF4/Metadata.json',
    JSON.stringify(nonDuplicateData, null, 2)
  )
}

run()
export { run }
