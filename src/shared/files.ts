import fs from 'fs'
import path from 'path';

export function GetFilesRec(dir: string): string[] {
    let files: string[] = [];

    // Go through each file and dir
    fs.readdirSync(dir).forEach(file => {
        const Absolute = path.join(dir, file);
        const parentDir = path.basename(dir);

        // Check if dir (recursive)
        if (fs.statSync(Absolute).isDirectory()) {

            // Recursive call to function with dir and then append parentDir to make path complete from root
            GetFilesRec(Absolute).forEach(f => {
                files.push(path.join(parentDir, f));
            });
        }
        else {
            files.push(path.join(parentDir, file));
        }
    });
    return files;
}

export function FilterByExt(files: string[], ext: string): string[]{
    return files.filter(f => path.extname(f) === ext);
}