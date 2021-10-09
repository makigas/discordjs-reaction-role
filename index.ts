import {
  Client,
  EmojiResolvable,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  Role,
  Snowflake,
  User,
} from "discord.js";

export interface ReactionRoleConfiguration {
  messageId: Snowflake;
  roleId: Snowflake;
  reaction: EmojiResolvable;
}

interface ReactionRoleReverseIndex {
  [server: string]: { [emoji: string]: string };
}

function buildReverseSearch(
  config: ReactionRoleConfiguration[]
): ReactionRoleReverseIndex {
  return config.reduce((index, conf) => {
    if (!index[conf.messageId]) {
      index[conf.messageId] = {};
    }
    index[conf.messageId][conf.reaction.toString()] = conf.roleId;
    return index;
  }, {} as ReactionRoleReverseIndex);
}

export default class ReactionRole {
  private reverseConfig: ReactionRoleReverseIndex;

  constructor(private client: Client, config: ReactionRoleConfiguration[]) {
    this.reverseConfig = buildReverseSearch(config);

    this.addReaction = this.addReaction.bind(this);
    this.removeReaction = this.removeReaction.bind(this);

    client.on("messageReactionAdd", this.addReaction);
    client.on("messageReactionRemove", this.removeReaction);
  }

  private extractRole(reaction: MessageReaction): Promise<Role | null> {
    const messageId = reaction.message.id;
    const reactionName = reaction.emoji.id || reaction.emoji.name;
    if (
      reactionName != null &&
      this.reverseConfig[messageId] &&
      this.reverseConfig[messageId][reactionName]
    ) {
      const roleId = this.reverseConfig[messageId][reactionName];
      if (reaction.message.guild) {
        return reaction.message.guild.roles.fetch(roleId);
      } else {
        return Promise.resolve(null);
      }
    }
    return Promise.resolve(null);
  }

  private async addReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): Promise<void> {
    Promise.all([reaction.fetch(), user.fetch()])
      .then(async ([reaction, user]) => {
        /* Early leave if the message is not sent to a guild. */
        if (!reaction.message.guild) {
          return;
        }

        /* Get the member that reacted originally. */
        const member = await reaction.message.guild.members.fetch(user.id);
        if (!member) {
          return;
        }

        /* Try to add the member to the guild. */
        await this.extractRole(reaction).then((role) => {
          if (role) {
            return member.roles.add(role);
          }
        });
      })
      .catch((e) => {
        console.error(
          "An error happened inside the addReaction handler of discordjs-reaction-role"
        );
        console.error(e);
      });
  }

  async removeReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ): Promise<void> {
    Promise.all([reaction.fetch(), user.fetch()])
      .then(async ([reaction, user]) => {
        /* Early leave if the message is not sent to a guild. */
        if (!reaction.message.guild) {
          return;
        }

        /* Get the member that reacted originally. */
        const member = await reaction.message.guild.members.fetch(user.id);
        if (!member) {
          return;
        }

        /* Try to add the member to the guild. */
        await this.extractRole(reaction).then((role) => {
          if (role) {
            return member.roles.remove(role);
          }
        });
      })
      .catch((e) => {
        console.error(
          "An error happened inside the removeReaction handler of discordjs-reaction-role"
        );
        console.error(e);
      });
  }

  teardown(): void {
    this.client.off("messageReactionAdd", this.addReaction);
    this.client.off("messageReactionRemove", this.removeReaction);
  }
}
