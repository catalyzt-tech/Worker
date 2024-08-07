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
      let flagAvatarFound = false

      if (badgeholder.ensAddress) {
        try {
          const response = await fetch(
            `https://euc.li/${badgeholder.ensAddress}`
          )
          if (response.status === 200) {
            flagAvatarFound = true
            console.log(response)
          } else {
            flagAvatarFound = false
            console.log('Not found')
          }
        } catch (error) {
          console.error('Fetch error:', error)
        }

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
          avatarUrl: flagAvatarFound
            ? `https://euc.li/${badgeholder.ensAddress}`
            : null,
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
          avatarUrl: null,
        }
        badgeholderR4Data.push(newData)
      }
    }
    console.log(badgeholder.address)
    console.log(count)
  }
  fs.writeFileSync(
    './data/RetroPGF4/Badgeholder/badgeholder_merge_final.json',
    JSON.stringify(badgeholderR4Data, null, 2)
  )
}

export { run }

run()
