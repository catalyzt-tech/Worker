import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const dataDir = path.resolve(__dirname, "..", "data");

app.get('/api/:filename', (req, res) => {
    const filePath = path.join(dataDir, `${req.params.filename}.json`);

    console.log(filePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('File not found');
        } else {
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (e) {
                res.status(500).send('Error parsing JSON');
            }
        }
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
