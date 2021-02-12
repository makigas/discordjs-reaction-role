import {
  Client,
  EmojiResolvable,
  MessageReaction,
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
    index[conf.messageId][conf.reaction] = conf.roleId;
    return index;
  }, {});
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

  private extractRole(reaction: MessageReaction): Promise<Role> {
    const messageId = reaction.message.id;
    const reactionName = reaction.emoji.name;
    if (
      this.reverseConfig[messageId] &&
      this.reverseConfig[messageId][reactionName]
    ) {
      const roleId = this.reverseConfig[messageId][reactionName];
      return reaction.message.guild.roles.fetch(roleId);
    }
  }

  private async addReaction(
    reaction: MessageReaction,
    user: User
  ): Promise<void> {
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
  }

  async removeReaction(reaction: MessageReaction, user: User): Promise<void> {
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
  }

  teardown(): void {
    this.client.off("messageReactionAdd", this.addReaction);
    this.client.off("messageReactionRemove", this.removeReaction);
  }
}
