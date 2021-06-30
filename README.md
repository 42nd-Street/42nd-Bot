# 42nd Street Bot

In development

Current stack:

- Node.js
- discord.js
- Typescript
- Docker (w/ Docker Compose)

## Requirements
- You need Docker to run it with the database
- Without the db, just node and npm is sufficient


To install, configure .env then do
```
npm install
```

To start, run
```
docker compose up --build --force-recreate
```

## Adding a (Slash) Command

To add a command you must register it as a slash command, and add handling for when the command is called.

### Registering the Command

Just add your commands name & description to this array in the registerSlashCommands() function, then type `~registerslashcommands` (all lower case) somewhere where the bot can see it. You should recive confimation.
```typescript
const data = [
    {
        name: 'ping',
        description: 'Test command, replies with pong.',
    },
    {
        name: 'name', // All lower case & no spaces
        description: 'description',
    },
];
```

### Handling the command

Put you're own if statement checking for the command being called here, where you can call either a simple line of code or preferably a function containing all your code.

```typescript
client.on('interaction', async interaction => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName === 'ping') await interaction.reply('Pong!');
    if (interaction.commandName === 'ping') await yourFunction(interaction); // You may not need to pass the interaction through, depending on what your command is doing
});
```