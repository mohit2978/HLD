const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'notes-folders');

// Create base directory if not exists
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

for (let i = 0; i <= 15; i++) {
    const folderName = i.toString().padStart(3, '0');
    const folderPath = path.join(baseDir, folderName);

    // Create subfolder
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    // File name always '000notes.md'
    const filePath = path.join(folderPath, '000notes.md');

    // Write heading inside the file
    fs.writeFileSync(filePath, '# Notes\n');

    console.log(`Created ${filePath}`);
}

console.log('Done creating folders with 000notes.md inside each.');
