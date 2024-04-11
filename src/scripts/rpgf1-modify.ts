import fs from "fs"


const run = () => {
  const data = fs.readFileSync(
    'raw/rpgf1.json',
    'utf-8'
  )


  const json = JSON.parse(data)
  const uniqueImpactCategories = new Set();
  let max = -1

  
  //@ts-ignore
  json.forEach(obj => {
    if(obj["allocation"] === ""){
        obj["allocation"] = 0
    }
    if (typeof obj["allocation"] === 'string' && !isNaN(parseFloat(obj["allocation"]))) {
        obj["allocation"] = parseFloat(obj["allocation"].replace(/,/g, '')); 
      }
      if(obj.allocation > max) {
        max = obj.allocation
      }
  });
//   console.log("Max ->")
//   console.log(max)
  return json
}

// run()
export { run }
