import fs from 'fs'
import path from 'path';

export function GetFilesRec(dir: string): string[] {
    let files: string[] = [];
    fs.readdirSync(dir).forEach(file => {
        const Absolute = path.join(dir, file);
        const parentDir = path.basename(dir);

        if (fs.statSync(Absolute).isDirectory()) {
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