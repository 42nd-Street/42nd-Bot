import { Client, Message } from "discord.js";

export interface msgEvent {
    msg: Message,
    client: Client,
}