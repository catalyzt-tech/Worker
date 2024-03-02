import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve(__dirname, 'src/scripts');

fs.readdir(scriptsDir, (err, files) => {
  if (err) {
    console.error(`Could not list the directory: ${err}`);
    return;
  }

  files.forEach((file, index) => {
    if (path.extname(file) === '.ts') {
      import(path.resolve(scriptsDir, file))
        .then((script) => {
          console.log(`Successfully imported ${file}`);
          const data = script.run();
          const jsonData = JSON.stringify(data);
          
          fs.writeFile(`./data/${file}.json`, jsonData, (err) => {
            if (err) {
              console.error(`Error writing data from ${file}:`, err);
            } else {
              console.log(`Successfully wrote to ${file}.json`);
            }
          });
        })
        .catch((err) => {
          console.error(`Failed to import ${file}: ${err}`);
        });
    }
  });
});