import https from 'https';
import { PassThrough } from 'stream';

export async function getStream(url: string) {
    let stream = new PassThrough();

    https.get(url, (res) => res.pipe(stream))

    //await new Promise(fullfill => stream.on('end',fullfill))
    return stream;
}

