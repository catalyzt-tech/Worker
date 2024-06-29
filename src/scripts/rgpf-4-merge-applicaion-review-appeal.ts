import rpgf4_application_appeal from '../../data/RetroPGF4/optimismResource/rpgf4_applicarion_review.json'
import rpgf4 from '../../data/RetroPGF4/(3)rpgf4_merged_eligiblity_not_met_appeal.json'
import fs from 'fs'

const run = () => {
  let count = 0
  const unmatchedProjectIds = new Set(
    rpgf4_application_appeal.map((app) => app.Project_id)
  )

  for (let i = 0; i < rpgf4.length; i++) {
    for (let j = 0; j < rpgf4_application_appeal.length; j++) {
      if (rpgf4[i].projectId === rpgf4_application_appeal[j].Project_id) {
        count++
        unmatchedProjectIds.delete(rpgf4_application_appeal[j].Project_id)
        const newData = {
          isApplicationReviewApproved:
            rpgf4_application_appeal[j]['Final Status'] === 'Approved'
              ? true
              : false,
          applicationRejectReason: rpgf4_application_appeal[j]['Reason']
            ? rpgf4_application_appeal[j]['Reason']
            : null,
          appealed: rpgf4_application_appeal[j].Appealed
            ? Boolean(rpgf4_application_appeal[j].Appealed.toLowerCase)
            : null,
          appealStatement: rpgf4_application_appeal[j]['Appeal Statement']
            ? rpgf4_application_appeal[j]['Appeal Statement']
            : null,
          appealDecision: rpgf4_application_appeal[j]['Appeal Decision']
            ? rpgf4_application_appeal[j]['Appeal Decision']
            : null,
        }
        rpgf4[i] = { ...rpgf4[i], applicationReview: newData } as any
      }
    }
  }

  fs.writeFileSync(
    './data/RetroPGF4/(4)rpgf4_merged_application_review_appeal.json',
    JSON.stringify(rpgf4, null, 2)
  )

  // Log unmatched project IDs
  unmatchedProjectIds.forEach((id) => console.log('Unmatched Project ID:', id))
}

run()
export { run }
