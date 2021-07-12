import { Client, CommandInteraction, Message } from "discord.js";

export interface SlashCommandOptions {
    name: string,
    description: string,
}

// Events
export interface msgEvent {
    msg: Message,
    client: Client,
}

export interface cmdEvent {
    interaction: CommandInteraction,
    client: Client
}

