const { Role } = require("discord.js");
const { Command } = require("discord.js-commando");
module.exports = class React extends Command {
  constructor(client) {
    super(client, {
      name: "react",
      group: "owner",
      memberName: "react",
      description: "Used to make the bot react to a message",
      guildOnly: true,
      hidden: true,
      ownerOnly: true,
      args: [
        {
          type: "text-channel",
          key: "channel",
          prompt: "Which channel does the message exist?",
        },
        {
          type: "message",
          key: "message",
          prompt: "Which message should I react?",
        }
      ]
    });
  }
  async run(msg, {channel, message}) {
    const selfReaction = async (reaction, user) => {
      if(msg.author.id !== user.id || reaction.message.id !== msg.id) return;
      await msg.delete();
      this.client.off("messageReactionAdd", selfReaction);
      const reply = await this.client.channels.cache.get(channel.id).messages.fetch(message.id);
      if(!reply) return msg.reply("The message ID you entered does not exist!");
      reply.react(reaction.emoji);
    };
    this.client.on("messageReactionAdd", selfReaction);
  }
};