import fs from 'fs'
import rawSubmitRPGF4 from '../../data/RetroPGF4/response-2.json'

interface Attestation {
  attester: string
  decodedDataJson: string
}
interface CleanedData {
  round: number
  projectRefUID: string
  farcasterID: number | string
  metadataSnapshotRefUID: string
}

const formatJSON = (attester: string, decodeUnformat: string) => {
  const parseDecodedData = (data: Attestation): CleanedData => {
    const decodedData: any[] = JSON.parse(data.decodedDataJson)
    const cleanedData: CleanedData = {
      round: 4,
      projectRefUID: '',
      farcasterID: '',
      metadataSnapshotRefUID: '',
    }

    decodedData.forEach((item) => {
      console.log(item.name, item.value.value)
      switch (item.name) {
        case 'projectRefUID':
          cleanedData.projectRefUID = item.value.value
          break
        case 'farcasterID':
          cleanedData.farcasterID = item.value.value.hex
            ? parseInt(item.value.value.hex, 16)
            : Number(item.value.value)
          break
        case 'metadataSnapshotRefUID':
          cleanedData.metadataSnapshotRefUID = item.value.value
          break
        // Removed cases for 'name', 'category', 'parentProjectRefUID', 'metadataType', 'metadataUrl'
      }
    })

    return cleanedData
  }

  const cleanedData = parseDecodedData({
    attester,
    decodedDataJson: decodeUnformat,
  })
  return cleanedData
}
const run = () => {
  const data: Attestation[] = rawSubmitRPGF4.data.attestations as Attestation[]
  const formattedData: CleanedData[] = []
  //   console.log(data[0])
  for (let i = 0; i < data.length; i++) {
    const decodeData = formatJSON(data[i].attester, data[i].decodedDataJson)
    formattedData.push(decodeData)
  }
  //   console.log(formattedData[0])
  fs.writeFileSync(
    './data/RetroPGF4/rpgf4_submit.json',
    JSON.stringify(formattedData, null, 2)
  )
}

run()
export { run }
