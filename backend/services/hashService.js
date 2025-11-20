import { createHash } from 'crypto';

export function generateHash(text){
    return createHash("sha256").update(text).digest('hex');

}