import fs from 'fs'
import data from '../../data/RetroPGF4/rpgf4_finalsubmit_merge.json'

interface SocialLinks {
  website: string[]
  farcaster: string[]
  twitter: string
  mirror: null | string
}

interface Contract {
  address: string
  deploymentTxHash: string
  deployerAddress: string
  chainId: number
}

interface GrantsAndFunding {
  ventureFunding: any[]
  grants: any[]
  revenue: any[]
}

interface Project {
  name: string
  description: string
  projectAvatarUrl: string
  proejctCoverImageUrl: string // Note: There's a typo in "proejctCoverImageUrl", consider correcting it if it's not intentional.
  category: string
  osoSlug: string
  socialLinks: SocialLinks
  team: string[]
  github: string[]
  packages: any[]
  contracts: Contract[]
  grantsAndFunding: GrantsAndFunding
}
const getMetadataUrl = async (data: any) => {
  try {
    const fetchMetadata = await fetch(data.metadataUrl)
    const metadata = await fetchMetadata.json()
    // metadata.description = metadata.description.replace(/(\r\n|\n|\r)/gm, ' ')
    return metadata as Project
  } catch (error) {
    // console.error(error)
    console.log('error fetching metadata for', data.name)
  }
}
const run = async () => {
  const fetchAllProjectMetadata: Project[] = []
  const processData = async () => {
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].metadataUrl)
      const metadata: Project = (await getMetadataUrl(data[i])) as Project
      console.log(i, metadata.name)
      fetchAllProjectMetadata.push(metadata)
    }
    await fs.writeFileSync(
      './data/RetroPGF4/rpgf4_pullmetadata_optimism-io.json',
      JSON.stringify(fetchAllProjectMetadata, null, 2)
    )
  }
  await processData()
}
run()
export { run }
