const { Role } = require("discord.js");
const { Command } = require("discord.js-commando");
module.exports = class ReactionRole extends Command {
  constructor(client) {
    super(client, {
      name: "reaction-role",
      group: "moderator",
      memberName: "reaction-role",
      description: "Listens to the message given and set role to the user who reacts it.",
      userPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS", "MANAGE_ROLES"],
      guildOnly: true,
      hidden: true,
      args: [
        {
          type: "string",
          key: "method",
          prompt: "What method do you want to use?",
          oneOf: ["add", "remove"]
        },
        {
          type: "text-channel",
          key: "channel",
          prompt: "Which channel should I look for the message?",
        },
        {
          type: "string",
          key: "message",
          prompt: "Which message should I proceed the operation?",
        },
        {
          type: "role",
          key: "role",
          prompt: "What role should I proceed the operation?",
        }
      ]
    });
  }
  async run(msg, {method, channel, message, role}) {
    const server = msg.guild;
    message = await channel.messages.fetch(message);
    if(!message) return msg.reply("The message ID you entered does exist!");
    const selfReaction = async (reaction, user) => {
      if(msg.author.id !== user.id || reaction.message.id !== msg.id) return;
      await reaction.users.remove(user.id);
      if(method === "add") {
        if(server["reaction-roles"].some(e => Object.assign(e, {message, channel, role, emoji: reaction.emoji}) == e)) return;
        server["reaction-roles"].push({message, channel, role, emoji: reaction.emoji});
        this.client.off("messageReactionAdd", selfReaction);
        message.react(reaction.emoji);
      }
      else if(method === "remove") {
        if(server["reaction-roles"].every(e => Object.assign(e, {message, channel, role, emoji: reaction.emoji}) != e)) return;
        server["reaction-roles"] = server["reaction-roles"].filter(e => Object.assign(e, {message, channel, role, emoji: reaction.emoji}) == e);
        let emoji = message.reactions.cache.array().find(e => e.emoji === reaction.emoji);
        if(!emoji) return;
        emoji.remove();
      }
    };
    this.client.on("messageReactionAdd", selfReaction);
  }
};