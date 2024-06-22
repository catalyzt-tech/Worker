import rpgf4 from '../../data/RetroPGF4/rpgf4.json'
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
        const newData: any = {
          ...rpgf4[i],
          appealed: rpgf4Appeal[j].Appealed,
          appeadDecision: rpgf4Appeal[j]['Appeal decision']
            ? rpgf4Appeal[j]['Appeal decision']
            : null,
          reason: rpgf4Appeal[j].Reason ? rpgf4Appeal[j].Reason : null,
          links: rpgf4Appeal[j].Links ? rpgf4Appeal[j].Links : null,
        }
        rpgf4[i] = newData
        console.log(count, newData.name)
      }
    }
    if (!flagFound) {
      const newData: any = {
        ...rpgf4[i],
        appealed: null,
        appeadDecision: null,
        reason: null,
        links: null,
      }
      rpgf4[i] = newData
    }
  }

  fs.writeFileSync(
    './data/RetroPGF4/rpgf4_merged_appeal.json',
    JSON.stringify(rpgf4, null, 2)
  )
}

run()
logUnmatchedAppeals()
export { run }
