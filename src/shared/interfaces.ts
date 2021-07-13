import { Client, CommandInteraction, Message } from "discord.js";

// Events
export interface msgEvent {
    msg: Message,
    client: Client,
}

export interface cmdEvent {
    interaction: CommandInteraction,
    client: Client
}

