import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve(__dirname, 'scripts');

fs.readdir(scriptsDir, (err, files) => {
  if (err) {
    console.error(`Could not list the directory: ${err}`);
    return;
  }

  files.forEach((file, index) => {
    if (path.extname(file) === '.ts') {
      import(path.resolve(scriptsDir, file))
        .then(async (script) => {
          console.log(`Successfully imported ${file}`);
          const data = await script.run();
          const jsonData = JSON.stringify(data);
          
          fs.writeFile(`./data/${file.split(".")[0]}.json`, jsonData, (err) => {
            if (err) {
              console.error(`Error writing data from ${file}:`, err);
            } else {
              console.log(`Successfully wrote to ${file.split(".")[0]}.json`);
            }
          });
        })
        .catch((err) => {
          console.error(`Failed to import ${file}: ${err}`);
        });
    }
  });
});