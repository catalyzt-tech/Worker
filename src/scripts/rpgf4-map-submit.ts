import fs from 'fs'
import Metadata from './../../data/RetroPGF4/Metadata.json'
import rpgf4_submit from './../../data/RetroPGF4/rpgf4_submit.json'
const run = async () => {
  const metadata: any[] = Metadata
  const submit: any[] = rpgf4_submit
  const submitData: any[] = []
  for (let i = 0; i < submit.length; i++) {
    const submitItem = submit[i]
    for (let j = 0; j < metadata.length; j++) {
      const metadataItem = metadata[j]
      if (submitItem.projectRefUID === metadataItem.projectRefUID) {
        submitData.push({
          ...submitItem,
          ...metadataItem,
        })
        break
      }
    }
  }
  console.log(submitData.length)
  fs.writeFileSync(
    './data/RetroPGF4/rpgf4_finalsubmit_merge.json',
    JSON.stringify(submitData, null, 2)
  )
}
run()
export { run }
