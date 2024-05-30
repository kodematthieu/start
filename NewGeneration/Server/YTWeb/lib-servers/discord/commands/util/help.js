const { stripIndents, oneLine } = require("common-tags");
const { Role, MessageEmbed } = require("discord.js");
const { Command } = require("discord.js-commando");
module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      group: "util",
      memberName: "help",
      description: "Displays a list of available commands, or detailed information for a specified command.",
      guarded: true,
      args: [
        {
          type: "string",
          key: "cmd",
          prompt: "Which command would you like to view the help for?",
          default: ""
        }
      ]
    });
  }
  async run(msg, args) {
    const embed = new MessageEmbed({thumbnail: {url: msg.channel.guild.iconURL()}, author: {name: this.client.user.username, iconURL: this.client.user.avatarURL()}, title: "Command Help", color: "GREEN", timestamp: Date.now(), footer: {text: `Requested by ${msg.author.tag}`, iconURL: msg.author.avatarURL()}});
    if(!args.cmd) {
      embed.description = stripIndents`
      To run a command use the prefix **__${msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix}__** or mention me.
      Use ${this.usage("<command>")} to have a detailed help for the command.
      `;
      for(const g of this.client.registry.groups.array()) {
        let ftext = "";
        for(let c of g.commands.array()) {
          if(c.hidden) continue;
          ftext += `- **${c.name}**: ${c.description}\n`;
        }
        if(ftext) embed.addField(`__${g.name}__`, ftext);
      }
    }
    else if(args.cmd && this.client.registry.commands.array().find(e => e.name === args.cmd || e.aliases.includes(args.cmd))) {
      const command = this.client.registry.commands.array().find(e => e.name === args.cmd || e.aliases.includes(args.cmd));
      embed.title = embed.title + `: *${command.name}*`;
      embed.description = (command.details || command.description);
      if(command.format) embed.addField("**__Format__**", `\`${command.name} ${command.format}\``);
      if(command.argsCollector && command.argsCollector.args.length > 0) {
        let ftext = "";
        for(const arg of command.argsCollector.args) ftext += `- **${arg.label}**: ${arg.prompt} ${arg.default !== null ? `(Optional)` : "(Required)"}\n`;
        embed.addField("__Arguments__", ftext);
      }
      if(command.examples) embed.addField("__Examples__", command.aliases.map(e => `- \`${e}\``).join("\n"));
      if(command.throttling) embed.addField("__Cooldown__", `- **Time**: ${command.throttling.duration}s\n- **Usages**: ${command.throttling.usages}`);
      if(command.aliases.length > 0) embed.addField("__Aliases__", command.aliases.map(e => `\`${e}\``).join("\n"));
      if(command.userPermissions) embed.addField("__Permissions__", command.userPermissions.map(e => `\`${e}\``).join("\n"));
    }
    msg.embed(embed);
  }
};