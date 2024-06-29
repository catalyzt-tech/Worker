import rpgf4 from '../../data/RetroPGF4/(2)rpgf4_finalmetadata_no_duplicate.json'
import rpgf4Appeal from '../../data/RetroPGF4/rpgf4_appeal.json'
import fs from 'fs'
function cleanParamsName(name: string) {
  const safeName = String(name).trim()
  const cleanName = safeName.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '')
  return cleanName
}

function logUnmatchedAppeals() {
  const rpgf4Names = new Set(
    rpgf4.map((item) => cleanParamsName(item.name).toLowerCase())
  )
  rpgf4Appeal.forEach((appeal, index) => {
    const appealName = cleanParamsName(appeal.Name as string)
    if (!rpgf4Names.has(appealName.toLowerCase())) {
      console.log(`Unmatched Appeal at index ${index}:`, appeal.Name)
    }
  })
}
const run = async () => {
  let count = 0
  for (let i = 0; i < rpgf4.length; i++) {
    let flagFound = false
    for (let j = 0; j < rpgf4Appeal.length; j++) {
      if (
        cleanParamsName(rpgf4[i].name as string) ===
        cleanParamsName(rpgf4Appeal[j].Name as string)
      ) {
        flagFound = true
        count++
        const eligibilityRejectReason: string[] | null =
          rpgf4Appeal[j]['Eligibiltiy Rejection reason'].split(';')
        const newData: any = {
          isEligibilityResultStatus:
            (rpgf4Appeal[j].Appealed === 'Yes' &&
              rpgf4Appeal[j]['Appeal decision'] === 'Approved') ||
            rpgf4Appeal[j].Appealed === ''
              ? true
              : false,
          eligibilityRules:
            eligibilityRejectReason.length == 2
              ? eligibilityRejectReason[0]
              : null,
          eigibilityRejectReason:
            eligibilityRejectReason.length == 2
              ? eligibilityRejectReason[1]
              : eligibilityRejectReason[0],
          appealed: rpgf4Appeal[j].Appealed,
          appealDecision: rpgf4Appeal[j]['Appeal decision']
            ? rpgf4Appeal[j]['Appeal decision']
            : null,
          reason: rpgf4Appeal[j].Reason ? rpgf4Appeal[j].Reason : null,
          links: rpgf4Appeal[j].Links ? rpgf4Appeal[j].Links : null,
        }
        rpgf4[i] = { ...rpgf4[i], eligibilityReview: newData } as any
        console.log(count, newData.name)
      }
    }
    if (!flagFound) {
      const newData: any = {
        isEligibilityResultStatus: true,
        eligibilityRules: null,
        eligibilityRejectReason: null,
        appealed: null,
        appealDecision: null,
        reason: null,
        links: null,
      }
      rpgf4[i] = { ...rpgf4[i], eligibilityReview: newData } as any
    }
  }

  fs.writeFileSync(
    './data/RetroPGF4/(3)rpgf4_merged_eligiblity_not_met_appeal.json',
    JSON.stringify(rpgf4, null, 2)
  )
}

run()
logUnmatchedAppeals()
export { run }
