import { Message } from 'discord.js';
import { msgEvent } from '@shared/interfaces';
import { AutoreplyEmbedGen } from '@shared/embed';

export function run(e: msgEvent) {
    e.msg.channel.send(AutoreplyEmbedGen("dank", "https://cdn.discordapp.com/attachments/405042469000970255/587229706835853312/220px-Adobe_XD_CC_icon.svg_-_Copy.png", e.msg))
}

export function match(msg: Message) {
    // Adds exception for Ryans id for danke
    return msg.content.toLowerCase() === "dank" || (msg.content.toLowerCase() === "danke" && msg.author.id == "225723089810358282");
}