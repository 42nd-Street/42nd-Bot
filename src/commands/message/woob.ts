import { Message } from 'discord.js';
import { msgEvent } from '../../shared/interfaces';
import { AutoreplyEmbedGen } from '../../shared/embed';

export function run(e: msgEvent) {
    e.msg.channel.send(AutoreplyEmbedGen("WOOB", "https://cdn.discordapp.com/attachments/367021334217359361/587651957368291331/woobSmall.png", e.msg))
    e.msg.delete();
}

export function match(msg: Message): boolean {
    if (msg.content.toLowerCase() === "woob") return true;

    return false;
}