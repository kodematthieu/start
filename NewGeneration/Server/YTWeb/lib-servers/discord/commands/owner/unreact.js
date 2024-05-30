const { Role } = require("discord.js");
const { Command } = require("discord.js-commando");
module.exports = class Unreact extends Command {
  constructor(client) {
    super(client, {
      name: "unreact",
      group: "owner",
      memberName: "unreact",
      description: "Used to make the bot unreact to a message",
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
          prompt: "Which message should I unreact?",
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
      const emoji = reply.reactions.cache.array().find(e => e.users.cache.array().find(e => e.id === this.client.user.id));
      if(!emoji) return;
      emoji.users.remove(this.client.user);
    };
    this.client.on("messageReactionAdd", selfReaction);
  }
};