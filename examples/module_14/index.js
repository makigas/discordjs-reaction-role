/*
 * This is an integration example that shows how to use this package
 * in JavaScript when the project is making use of JavaScript modules
 * (so you import using "import from").
 */

import { Client, GatewayIntentBits, Partials, version } from "discord.js";
import { ReactionRole } from "discordjs-reaction-role";

// Make sure that all the three environment variables are declared.
["BOT_TOKEN", "ROLE", "MESSAGE"].forEach((env) => {
  if (!process.env[env]) {
    console.error(`Missing environment variable: ${env}`);
    process.exit(1);
  }
});

// Create a client with the intents and partials required.
const client = new Client({
  partials: [Partials.Message, Partials.Reaction],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Create a new manager and use it.
const configuration = [
  {
    messageId: process.env.MESSAGE,
    reaction: "✅", // :white_check_mark:
    roleId: process.env.ROLE,
  },
];
const manager = new ReactionRole(client, configuration);

// Start the bot.
client.on("ready", () => {
  console.log("Bot is online! Example: modules. DJS version:", version);
});
client.login(process.env.BOT_TOKEN);

// Stop the bot when the process is closed (via Ctrl-C).
const destroy = () => {
  manager.teardown();
  client.destroy();
};
process.on("SIGINT", destroy);
process.on("SIGTERM", destroy);
