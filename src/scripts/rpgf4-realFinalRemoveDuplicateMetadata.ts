import fs from 'fs'
import unfilterMetadata from '../../data/RetroPGF4/rpgf4_pullmetadata_optimism-io.json'
const run = () => {
  const unDeplicateMetadata: any[] = []
  let countDuplicate = 0
  const processData = () => {
    for (let i = 0; i < unfilterMetadata.length; i++) {
      const metadata = unfilterMetadata[i]
      const isDuplicate = unDeplicateMetadata.some(
        (item) => item.name === metadata.name
      )
      if (isDuplicate) {
        countDuplicate++
        console.log('Duplicate:', metadata.name, countDuplicate)
      }
      if (!isDuplicate) {
        unDeplicateMetadata.push(metadata)
      }
    }
    console.log('unfilterMetadata:', unfilterMetadata.length)
    fs.writeFileSync(
      './data/RetroPGF4/rpgf4_finalmetadata_no_duplicate.json',
      JSON.stringify(unDeplicateMetadata, null, 2)
    )
    console.log('Final Project = ', unfilterMetadata.length - countDuplicate)
  }
  processData()
}
run()
export { run }
