import { Message } from 'discord.js';
import { msgEvent } from '../../shared/interfaces';
import { AutoreplyEmbedGen } from '../../shared/embed';
import { get_random } from '../../shared/utils';
let cursed_images=["https://cdn.discordapp.com/attachments/470387639649042432/617484247136993299/pigeon.jpg","https://cdn.discordapp.com/attachments/470387639649042432/617484877344014362/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617484963805266144/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617485508888756224/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617484988060794887/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617486017922072586/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617486017922072586/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617486228006371358/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617486673445519430/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617487231912902660/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617487274023714862/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617487434032349205/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617487608292966482/pidge.png","https://cdn.discordapp.com/attachments/470387639649042432/617488156031451147/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617488600627675137/unknown.png", "https://cdn.discordapp.com/attachments/470387639649042432/617488805909364755/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617493543329595463/curse_me_daddy.png","https://cdn.discordapp.com/attachments/470387639649042432/617494009962692609/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617494674978111499/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617491238802817026/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617493519480913924/unknown.png","https://cdn.discordapp.com/attachments/470387639649042432/617492016514727937/unknown.png"]

export function run(e: msgEvent) {
    e.msg.channel.send(AutoreplyEmbedGen("c̵u̸r̷s̶e̵d̶ ̸b̵i̶r̷b̷ ", get_random(cursed_images), e.msg))
    e.msg.delete();
}

export function match(msg: Message) {
    return msg.content.toLowerCase() === "cursed birb";
}