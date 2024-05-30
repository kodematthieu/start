const { Role } = require("discord.js");
const { Command } = require("discord.js-commando");
module.exports = class ClearChat extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      aliases: ["clear-chat"],
      group: "moderator",
      memberName: "clear",
      description: "Clears/Deletes a certain message.",
      userPermissions: ["MANAGE_MESSAGES"],
      guildOnly: true,
      hidden: true,
      throttling: {
        duration: 5*60,
        usages: 5
      },
      args: [
        {
          type: "integer",
          key: "amount",
          prompt: "How many messages do you want to clear?",
          default: 50,
          max: 100,
          min: 1
        },
        {
          type: "member|user|role",
          key: "user",
          prompt: "Who's messages do you want to clear?",
          default: false
        }
      ]
    });
  }
  async run(msg, {amount, user}) {
    let index = 30;
    let messages;
    if(user instanceof Role) messages = (await msg.channel.messages.fetch()).filter(m => m.member.roles.cache.array().includes(user)).first(amount + 1);
    else messages = (await msg.channel.messages.fetch()).filter(m => typeof user !== "boolean" ? m.author.id === user.user.id : true).first(amount + 1);
    const waits = [];
    for(const message of messages) waits.push(message.delete());
    await Promise.all(waits);
    const reply = await msg.reply(`${messages.length - 1} messages${user ? " from " + user.toString() : ""} has been cleared silently! This message will be removed after 30 seconds.`);
    const timer = setInterval(async () => {
      try {
        if(index > 0) {
          index--;
          await reply.edit(reply.content.replace(/\d+\sseconds\.$/, index + " seconds."));
        }
        else {
          clearInterval(timer);
          await reply.delete();
        }
      }
      catch(e) {clearInterval(timer)}
    }, 1000);
  }
};