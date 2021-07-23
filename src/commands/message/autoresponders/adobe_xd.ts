import { Message } from 'discord.js';
import { msgEvent } from '../../../shared/interfaces';
import { AutoreplyEmbedGen } from '../../../shared/embed';

export function run(e: msgEvent) {
    e.msg.channel.send(AutoreplyEmbedGen("Xd", "https://cdn.discordapp.com/attachments/405042469000970255/587229465478823955/220px-Adobe_XD_CC_icon.svg.png", e.msg))
}

export function match(msg: Message) {
    return msg.content === "Xd" || msg.content === "Adobe Xd";
}