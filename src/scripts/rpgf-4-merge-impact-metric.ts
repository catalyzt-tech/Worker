import rpgf4 from '../../data/RetroPGF4/(5)rpgf4_merged_githubstats.json'
import impactMetric from '../../data/RetroPGF4/osoResource/osoImpactMetrics.json'
import fs from 'fs'

interface ImpactMetricData {
  application_id: string
  is_oss: boolean
  gas_fees: number
  transaction_count: number
  trusted_transaction_count: number
  trusted_transaction_share: number
  trusted_users_onboarded: number
  daily_active_addresses: number
  trusted_daily_active_users: number
  monthly_active_addresses: number
  trusted_monthly_active_users: number
  recurring_addresses: number
  trusted_recurring_users: number
  power_user_addresses: number
  openrank_trusted_users_count: number
  log_gas_fees: number
  log_transaction_count: number
  log_trusted_transaction_count: number
}

const run = async () => {
  let count1 = 0,
    count2 = 0
  rpgf4.forEach((project, index) => {
    const matchedImpactMetric = impactMetric.find(
      (metric) => metric.application_id === project.projectId
    )
    if (matchedImpactMetric) {
      count1++
      rpgf4[index] = { ...project, impactMetrics: matchedImpactMetric } as any
    } else {
      count2++
      console.log('Not found:', project.projectId)
      rpgf4[index] = { ...project, impactMetrics: null } as any
    }
  })
  fs.writeFileSync(
    './data/RetroPGF4/(6)rpgf4_merged_impact_metric.json',
    JSON.stringify(rpgf4, null, 2)
  )
  console.log('Matched:', count1, 'Not found:', count2)
}

run()
export { run }
