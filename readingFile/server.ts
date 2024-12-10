import express from 'express';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const PORT = 3000;

app.get('/documentation', (req, res) => {
    const docPath = path.resolve('./documentation.json');
    if (fs.existsSync(docPath)) {
        const documentation = fs.readFileSync(docPath, 'utf-8');
        res.json(JSON.parse(documentation));
    } else {
        res.status(404).send('Documentation not found. Run the extract script first.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/documentation`);
});
