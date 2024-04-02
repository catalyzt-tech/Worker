//Function can be written as Function Declaration or Arrow Function but the name should be run.
const run = async () => {
  let data

  let fetchRes = fetch("https://jsonplaceholder.typicode.com/todos/1");
  await fetchRes
    .then(res => res.json())
    .then(d => {
      data = d
    })

    
  return data
}

export { run }