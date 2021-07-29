import { cmdEvent } from '@interactions/interfaces'


// Responses related to voice
export const incorrectChannel = async (e: cmdEvent) => e.interaction.reply('Someone is already playing in another channel!')
export const notInVc = async (e:cmdEvent) => await e.interaction.reply('Not in a voice channel!');