/**
 * This file can be used to store custom embeds such as the one below.
 */

import Discord from 'discord.js'

export function AutoreplyEmbedGen(name: string, imgurl: string, msg: Discord.Message, link?: string) {
    const embed = new Discord.MessageEmbed()
        .setImage(imgurl)
        .setFooter(name + " from " + msg.author.tag); // Can put a link here if we want (idk what)
    if (link) embed.setURL(link);
    return { embeds: [embed] };
}
