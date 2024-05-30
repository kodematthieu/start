const { Role } = require("discord.js");
const { Command } = require("discord.js-commando");
module.exports = class ChannelID extends Command {
  constructor(client) {
    super(client, {
      name: "channelid",
      aliases: ["channel-id"],
      group: "moderator",
      memberName: "channelid",
      description: "Shows the ID of the given channel name.",
      userPermissions: ["MANAGE_GUILD"],
      guildOnly: true,
      hidden: true,
      args: [
        {
          type: "string",
          key: "channelname",
          prompt: "Which channel should get the ID from?"
        }
      ]
    });
  }
  async run(msg, {channelname}) {
    const channel = msg.guild.channels.cache.find(e => e.name === channelname);
    if(!channel) return msg.reply(`A channel with a name of **__${channelname}__** does not exist!`);
    msg.reply(`The channel ID of **__${channel.name}__** is \`${channel.id}\`.`);
  }
};