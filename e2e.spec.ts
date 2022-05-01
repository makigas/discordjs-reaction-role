/*
 * This is a functional test to assert that the library behaves as
 * it should. Yes, you should write unit tests, but your unit test
 * will not talk to the real Discord. Run this script with ts-node
 * and let the bot play to assert that it is working as expected.
 * Also, you can use this file to learn how to use the library.
 */

import { Client, Intents } from "discord.js";
import { ReactionRole } from "./index";

if (!process.env.BOT_TOKEN || !process.env.ROLE || !process.env.MESSAGE) {
  console.error("Missing config");
  process.exit(1);
}
const token: string = process.env.BOT_TOKEN;
const role: string = process.env.ROLE;
const message: string = process.env.MESSAGE;

const client = new Client({
  partials: ["MESSAGE", "REACTION"],
  intents:
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS |
    Intents.FLAGS.GUILD_MESSAGES |
    Intents.FLAGS.GUILDS,
});

new ReactionRole(client, [
  {
    messageId: message,
    reaction: "✅",
    roleId: role,
  },
]);

client.on("ready", () => {
  console.log("Bot is online");
});

client.login(token);
process.on("SIGINT", () => {
  client.destroy();
});
process.on("SIGTERM", () => {
  client.destroy();
});
