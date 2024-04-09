import fs from "fs"


const run = () => {
  const data = fs.readFileSync(
    'raw/rpgf3.json',
    'utf-8'
  )

  const uniqueImpactCategories = new Set();
    let max = -1
  const json = JSON.parse(data)
  //@ts-ignore
  json.forEach(obj => {
    if(typeof(obj.contributionLinks) === "string"){
      obj.contributionLinks = JSON.parse(obj.contributionLinks);
    }
    if (typeof(obj.impactCategory) === "string") {
      //@ts-ignore
      obj.impactCategory = JSON.parse(obj.impactCategory).map(category => {
        //@ts-ignore
        return category.split('_').map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
      });
    }
    
    
    if(typeof(obj.impactMetrics) === "string"){
      obj.impactMetrics = JSON.parse(obj.impactMetrics);
    }
    if(typeof(obj.fundingSources) === "string"){
      obj.fundingSources = JSON.parse(obj.fundingSources);
    }
    if (Array.isArray(obj.impactCategory)) {
      obj.impactCategory.forEach((category:string) => {
        uniqueImpactCategories.add(category);
      });
    }
    if(obj.scaled > max) {
      max = obj.scaled
    }
  });
  console.log("Max val ->", max)
  console.log(uniqueImpactCategories)
  return json
}

// run()
export { run }
