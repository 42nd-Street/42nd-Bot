import { Track } from './track';

export class MusicQueue {
    public queue: Track[];
    public queueIndex: number;
    public looping: boolean;

    get length(): number { return this.queue.length };

    public constructor() {
        this.queue = [];
        this.looping = false;
        this.queueIndex = 0;
    }

    public push(track: Track) {
        this.queue.push(track);
    }

    public process(): Track | undefined {

        if (this.queueIndex >= this.queue.length) {
            if (this.looping) {
                this.queueIndex = 0;
            }
            else {
                // this will cause processQueue to return
                return undefined;
            }

        }
        return this.queue[this.queueIndex];
    }

    public finish() {
        if (this.looping) {
            this.queueIndex++;
        }
        else {
            this.queue.splice(this.queueIndex, 1);
        }

    }

    public clear() {
        this.queue = [];
        this.queueIndex = 0;
    }

    public remove(index: number) {
        if (index >= this.queue.length || index < 0) { throw new Error('Invalid position'); }
        this.queue.splice(index, 1);
    }

}