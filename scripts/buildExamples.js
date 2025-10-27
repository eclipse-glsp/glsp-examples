const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

dotenv.config();

const examples = JSON.parse(fs.readFileSync(path.join('src', 'examples.json'), 'utf8')).examples;

const copyDirectory = (src, dest, example) => {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath, example);
        } else {
            const file = fs.readFileSync(srcPath, 'utf8');
            const result = file.replace(/process\.env\.HOST_PATH/g, `'${process.env.HOST_PATH}/${example.path}'`);
            fs.writeFileSync(destPath, result, 'utf8');
        }
    }
};

examples.forEach(example => {
    exec('npm run build', { cwd: path.join('examples', example.buildPath) }, error => {
        if (error) {
            throw error;
        }
        const src = path.join('examples', example.buildPath, 'app');
        const dest = path.join('app', example.path);
        copyDirectory(src, dest, example);
        const file = fs.readFileSync(path.join('src', 'index.html'), 'utf8');
        const result = file.replace(/bundle\.js/g, `../bundle.js`).replace(/css\//g, '../css/');
        fs.writeFileSync(path.join(dest, 'index.html'), result, 'utf8');
    });
});
