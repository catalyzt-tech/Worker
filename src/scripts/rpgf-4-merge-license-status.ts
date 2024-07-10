import rpgf4_license_status from '../../data/RetroPGF4/optimismResource/rpgf4_license.json'
import rpgf4Data from '../../data/RetroPGF4/(6)rpgf4_merged_impact_metric.json'
import fs from 'fs'
const run = () => {
  let count = 0
  const rpgf4DataWithLicense = rpgf4Data.map((data) => {
    const license = rpgf4_license_status.find(
      (license) => license.ProjectID === data.projectId
    )
    if (license) {
      count++
      const newData = {
        ...data,
        isOpenSource: license['OS Status'] === 'Approved' ? true : false,
      }
      return newData
    }
    const newData = {
      ...data,
      isOpenSource: null,
    }
    return newData
  })
  console.log('Matched:', count)
  fs.writeFileSync(
    './data/RetroPGF4/(7)rpgf4_merged_with_license_source.json',
    JSON.stringify(rpgf4DataWithLicense)
  )
}
export { run }

run()
