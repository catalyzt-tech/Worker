import fs from "fs"


const run = () => {
  const data = fs.readFileSync(
    'raw/rpgf3.json',
    'utf-8'
  )
  const json = JSON.parse(data)
  //@ts-ignore
  json.forEach(obj => {
    if(typeof(obj.contributionLinks) === "string"){
      obj.contributionLinks = JSON.parse(obj.contributionLinks);
    }
    if(typeof(obj.impactCategory) === "string"){
      obj.impactCategory = JSON.parse(obj.impactCategory);
    }
    if(typeof(obj.impactMetrics) === "string"){
      obj.impactMetrics = JSON.parse(obj.impactMetrics);
    }
    if(typeof(obj.fundingSources) === "string"){
      obj.fundingSources = JSON.parse(obj.fundingSources);
    }
  });
  return json
}

// run()
export { run }
