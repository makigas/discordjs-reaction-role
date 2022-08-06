"use strict";
/*
 * This is an integration example that shows how to use this package
 * in TypeScript. It also allows to test that the typings generated
 * when building the package properly works.
 */
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var discordjs_reaction_role_1 = require("discordjs-reaction-role");
// Make sure that all the three environment variables are declared.
["BOT_TOKEN", "ROLE", "MESSAGE"].forEach(function (env) {
    if (!process.env[env]) {
        console.error("Missing environment variable: ".concat(env));
        process.exit(1);
    }
});
// Create a client with the intents and partials required.
var client = new discord_js_1.Client({
    partials: ["MESSAGE", "REACTION"],
    intents: discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS |
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES |
        discord_js_1.Intents.FLAGS.GUILDS
});
// Create a new manager and use it.
var MESSAGE = process.env.MESSAGE;
var ROLE = process.env.ROLE;
var configuration = [
    {
        messageId: MESSAGE,
        reaction: "✅",
        roleId: ROLE
    },
];
var manager = new discordjs_reaction_role_1.ReactionRole(client, configuration);
// Start the bot.
client.on("ready", function () {
    console.log("Bot is online! Example: typescript. DJS version:", discord_js_1.version);
});
client.login(process.env.BOT_TOKEN);
// Stop the bot when the process is closed (via Ctrl-C).
var destroy = function () {
    manager.teardown();
    client.destroy();
};
process.on("SIGINT", destroy);
process.on("SIGTERM", destroy);
