# discordjs-reaction-role

This is a pluggable package for Discord.js applications and bots. It will add or remove a member from a specific role whenever the user reacts or unreacts to a specific message using a specific reaction.

Example use cases:

- If a member reacts with 🔔 to a message, the member opts in to the Announcements role to be notified of updates.
- If a member reacts with ✅ to a message, the member gets verified as human.
- Use different roles to have different clans or groups in your server.
- Have different roles such as "Likes Cats", "Likes Dogs", "Likes Ducks" and let a member add to as many roles as desired to indicate their preferences.

## Requirements

A JavaScript project already depending on Discord.js 13.

**Still using Discord.js 12 and having a hard time upgrading?** 👉 Stay using discordjs-reaction-role 1.0.2, the last version supporting Discord.js 12. You can pin it in your package.json like this:

    "discordjs-reaction-role": "<2.0.0"

Sorry for stating this, but consider upgrading your bot.

## How to use

This library exposes a single class that depends on Discord.js. It tries to be agnostic of any other framework (such as Commando). This way, it should be easy to integrate into your existing bot system.

The constructor expects to be given the Discord.js client and the configuration object. For instance,

```js
const client = new Client(...);
const rr = new ReactionRole(client, [
  { messageId: "12341234", reaction: "🔔", roleId: "5959859595" }, // Basic usage
  { messageId: "12341234", reaction: "✅", roleId: "5959859598" }, // Multiple reactions per message!
  { messageId: "12341234", reaction: "784536908345", roleId: "5959859598" }, // Custom emoji by ID
  { messageId: "12341234", reaction: "worry", roleId: "5959859598" }, // Custom emoji by emoji name
]);
```

The configuration object is an array of entries. Each entry has three keys:

- `messageId`: the ID of the message that the user has to react to.
- `reaction`: the emoji that the user has to use, either as the custom emoji ID, the custom emoji name or the Unicode codepoint.
- `roleId`: the ID of the role that will be given to the user when reacted.

It is up to you how to set up the configuration object. For instance, in a small server or in a bot designed to be used with a single server, you might just hardcode the settings into the source code of your bot, although this is not recommended. You could use a SettingProvider or read it from database, download the JSON from the internet, or whatever. It is up to you.

**As soon as you instantiate the ReactionRole class, `messageReactionAdd` and `messageReactionRemove` events will be caught** and:

- When a member reacts using the given emoji to the given message, the member will be added to the role.
- When a member unreacts using the given emoji to the given message, the member will be removed from the role.

### require() support

Note that discordjs-reaction-role is using ESModules, so if you are using `require()`, you might need to get the `default` key:

```js
// Either:
const ReactionRole = require("discordjs-reaction-role").default;

// Or:
const { default: ReactionRole } = require("discordjs-reaction-role");
```

### TypeScript support

discordjs-reaction-role is written using TypeScript and thus it supports TypeScript out of the box. The library provides also a type definition (\*.d.ts) for projects using Visual Studio Code, either JavaScript or TypeScript.

### Teardown

If you need to remove the events (for instance, to restart the settings), you can call the `teardown` method:

```ts
function stop(role: ReactionRole) {
  role.teardown();
}
```

## Copyright and license

[ISC License](https://opensource.org/licenses/ISC). Happy to hear about
cool projects using this library.

```
Copyright 2021 Dani Rodríguez

Permission to use, copy, modify, and/or distribute this software for
any purpose with or without fee is hereby granted, provided that the
above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING
OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
