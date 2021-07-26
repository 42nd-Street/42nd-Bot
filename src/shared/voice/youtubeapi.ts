
import dotenv from 'dotenv'

dotenv.config()

import { YouTube } from 'popyt'

let youtube : YouTube

export const YT = () => {
    if (!youtube) {
        youtube = new YouTube(process.env.YOUTUBE_API_KEY)
    }
    return youtube
}

