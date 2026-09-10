import * as path from 'path';
export function uploadDir(){
    const uploadDir = path.join(__dirname, '../../../', 'uploads');
    return uploadDir;
}