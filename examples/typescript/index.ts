/*
 * This is an integration example that shows how to use this package
 * in TypeScript. It also allows to test that the typings generated
 * when building the package properly works.
 */

import { Client, Intents, Snowflake } from "discord.js";
import {
  ReactionRole,
  ReactionRoleConfiguration,
} from "discordjs-reaction-role";

// Make sure that all the three environment variables are declared.
["BOT_TOKEN", "ROLE", "MESSAGE"].forEach((env) => {
  if (!process.env[env]) {
    console.error(`Missing environment variable: ${env}`);
    process.exit(1);
  }
});

// Create a client with the intents and partials required.
const client = new Client({
  partials: ["MESSAGE", "REACTION"],
  intents:
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS |
    Intents.FLAGS.GUILD_MESSAGES |
    Intents.FLAGS.GUILDS,
});

// Create a new manager and use it.
const MESSAGE: Snowflake = process.env.MESSAGE!!;
const ROLE: Snowflake = process.env.ROLE!!;
const configuration: ReactionRoleConfiguration[] = [
  {
    messageId: MESSAGE,
    reaction: "✅", // :white_check_mark:
    roleId: ROLE,
  },
];
const manager = new ReactionRole(client, configuration);

// Start the bot.
client.on("ready", () => console.log("Bot is online!"));
client.login(process.env.BOT_TOKEN);

// Stop the bot when the process is closed (via Ctrl-C).
const destroy = () => {
  manager.teardown();
  client.destroy();
};
process.on("SIGINT", destroy);
process.on("SIGTERM", destroy);
