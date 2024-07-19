import badgeholderInfo from '../../../data/RetroPGF4/Badgeholder/badgeholder_info.json'
import badgeholderMetric from '../../../data/RetroPGF4/Badgeholder/badgeholder_metric.json'
import fs from 'fs'
const run = async () => {
  const badgeholderR4Data = []
  let count = 0
  for (let i = 0; i < badgeholderInfo.length; i++) {
    const badgeholder = badgeholderInfo[i]
    const badgeholderMetricFound = badgeholderMetric.find(
      (item) => item.Address === badgeholder.address
    )
    if (badgeholderMetricFound) {
      const newData = {
        address: badgeholder.address,
        ensName: badgeholder.ensAddress,
        joinMethod: badgeholder.joinedWith,
        joinDate: badgeholder.joinedAt,
        invitedBy: badgeholder.referredBy,
        metricInBallot: badgeholderMetricFound['Metrics in ballot'],
        metricViewed: badgeholderMetricFound['Metrics viewed'],
        openSourceMultiplier: badgeholderMetricFound['Os multiplier'],
        metricSelected: badgeholderMetricFound['Ballot content'],
      }
      count++
      badgeholderR4Data.push(newData)
    } else {
      const newData = {
        address: badgeholder.address,
        ensName: badgeholder.ensAddress,
        joinMethod: badgeholder.joinedWith,
        joinDate: badgeholder.joinedAt,
        invitedBy: badgeholder.referredBy,
        metricInBallot: null,
        metricViewed: null,
        openSourceMultiplier: null,
        metricSelected: null,
      }
      badgeholderR4Data.push(newData)
    }
  }
  console.log(count)
  fs.writeFileSync(
    './data/RetroPGF4/Badgeholder/badgeholder_mege_final.json',
    JSON.stringify(badgeholderR4Data, null, 2)
  )
}

export { run }

run()
