const { Role } = require("discord.js");
const { Command } = require("discord.js-commando");
module.exports = class Kick extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      group: "moderator",
      memberName: "kick",
      description: "Kicks a player from the server.",
      userPermissions: ["MANAGE_GUILD", "KICK_MEMBERS"],
      guildOnly: true,
      hidden: true,
      throttling: {
        duration: 5*60,
        usages: 1
      },
      args: [
        {
          type: "member|user",
          key: "user",
          prompt: "Who should I kick?",
        },
        {
          type: "string",
          key: "reason",
          prompt: "Why should I kick him/her/it?",
          default: ""
        }
      ]
    });
  }
  async run(msg, {user, reason}) {
    if(user.id === this.client.user.id) return msg.reply("I can't kick myself!");
    const tag = user.tag;
    const channel = await user.createDM();
    if(channel) channel.send(`I'm sorry but you have been kicked from **__${msg.channel.guild.name}__** by **__${msg.author.tag}__**${reason ? " because of this reason: `"+reason+"`" : ""}`);
    await this.client.guilds.cache.get(msg.channel.guild.id).member(user).kick(reason);
    msg.say(`**__${tag}__** has been kicked by ${msg.author.toString()}${reason ? " for a reason of `"+reason+"`" : ""}`);
  }
};