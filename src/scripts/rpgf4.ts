import fs from 'fs'
import rawRPGF4_unfilter from '../../data/RetroPGF4/rawMetadata_unfilter.json'

interface Attestation {
  attester: string
  decodedDataJson: string
}
interface CleanedData {
  attester: string
  projectRefUID: string
  farcasterID: number | string
  name: string
  category: string
  parentProjectRefUID: string
  metadataType: number
  metadataUrl: string
}

const formatJSON = (attester: string, decodeUnformat: string) => {
  interface DecodedValue {
    name: string
    type: string
    signature: string
    value: {
      name: string
      type: string
      value: any
    }
  }

  const parseDecodedData = (data: Attestation): CleanedData => {
    const decodedData: DecodedValue[] = JSON.parse(data.decodedDataJson)
    const cleanedData: CleanedData = {
      attester: data.attester,
      projectRefUID: '',
      farcasterID: '',
      name: '',
      category: '',
      parentProjectRefUID: '',
      metadataType: 0,
      metadataUrl: '',
    }

    decodedData.forEach((item) => {
      switch (item.name) {
        case 'projectRefUID':
          cleanedData.projectRefUID = item.value.value
          break
        case 'farcasterID':
          cleanedData.farcasterID = item.value.value.hex
            ? parseInt(item.value.value.hex, 16)
            : Number(item.value.value)
          break
        case 'name':
          cleanedData.name = item.value.value
          break
        case 'category':
          cleanedData.category = item.value.value
          break
        case 'parentProjectRefUID':
          cleanedData.parentProjectRefUID = item.value.value
          break
        case 'metadataType':
          cleanedData.metadataType = item.value.value
          break
        case 'metadataUrl':
          cleanedData.metadataUrl = item.value.value
          break
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
  const data: Attestation[] = rawRPGF4_unfilter.data
    .attestations as Attestation[]
  const formattedData: CleanedData[] = []
  //   console.log(data[0])
  for (let i = 0; i < data.length; i++) {
    const decodeData = formatJSON(data[i].attester, data[i].decodedDataJson)
    formattedData.push(decodeData)
  }
  //   console.log(formattedData[0])
  fs.writeFileSync(
    './data/RetroPGF4/Metadata_uncheckDuplicate.json',
    JSON.stringify(formattedData, null, 2)
  )
}

run()
export { run }
