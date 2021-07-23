import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from "@interactions/interfaces";

export const data: ApplicationCommandData = {
    name: "ping",
    description: "Replies :)"
}

export function run(e: cmdEvent) {
    e.interaction.reply("Pong!");
}