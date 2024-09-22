import fs from "fs";
import unzipper from "unzipper";

const downloadsFolder = process.env.USERPROFILE + "/Downloads";
const existingFiles = fs.readdirSync(downloadsFolder);
const destinationBase = ""; // Directory path goes here

fs.watchFile(downloadsFolder, {interval: 500}, () => {
    const files = fs.readdirSync(downloadsFolder);
    for (const file of files) {
        if (!existingFiles.includes(file) && file.startsWith("Lab") && file.endsWith(".zip")) {
            const sourcePath = `${downloadsFolder}/${file}`;
            const destinationPath = destinationBase + `/${file}`;

            fs.renameSync(sourcePath, destinationPath);
            fs.createReadStream(destinationPath)
                .pipe(unzipper.Extract({ path: destinationBase }))
                .on('close', () => {
                    fs.unlinkSync(destinationPath);
                    console.log(`Extracted ${file}`);
                });
        }
    }
});