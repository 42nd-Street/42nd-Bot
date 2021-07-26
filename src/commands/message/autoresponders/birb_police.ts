import { Message } from 'discord.js';
import { msgEvent } from '../../../shared/interfaces';
import { AutoreplyEmbedGen } from '../../../shared/embed';

export function run(e: msgEvent) {
    e.msg.channel.send(AutoreplyEmbedGen("The birb police", "https://cdn.discordapp.com/attachments/586659155138314261/620349820481175563/the_swarm_2.0.png", e.msg));
}

export function match(msg: Message): boolean {
    return msg.content.toLowerCase() === "call the birb police";
}