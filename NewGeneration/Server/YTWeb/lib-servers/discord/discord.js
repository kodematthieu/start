require("dotenv").config();
const path = require("path");
const { MessageEmbed } = require("discord.js");
const { CommandoClient } = require("discord.js-commando");

const config = require("./discord.json");

const client = new CommandoClient({
  commandPrefix: "!",
  owner: "584670803065307147",
  unknownCommandResponse: false,
  invite: "https://discord.com/api/oauth2/authorize?client_id=756874722385461350&permissions=8&scope=bot"
});

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({help: false})
  .registerGroups([
    ["owner", "Owners", true],
    ["moderator", "Mods", true], 
  ])
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.once("ready", () => {
  console.info(`${client.user.tag} bot is ready to use!`);
  for(const server of client.guilds.cache.array()) {
    server["reaction-roles"] = [];
    if((server.id) in config) client.emit("CountUpdate", server, ["member-count", "user-count", "bot-count", "role-count", "channel-count"]);
  }
});

/* Count Listeners */
client.on("guildMemberAdd", ({server: guild}) => client.emit("CountUpdate", server, ["member-count", "user-count", "bot-count"]));
client.on("guildMemberRemove", ({server: guild}) => client.emit("CountUpdate", server, ["member-count", "user-count", "bot-count"]));
client.on("roleCreate", ({server: guild}) => client.emit("CountUpdate", server, ["role-count"]));
client.on("roleDelete", ({server: guild}) => client.emit("CountUpdate", server, ["role-count"]));
client.on("channelCreate", ({server: guild}) => !!server ? client.emit("CountUpdate", server, ["channel-count"]) : null);
client.on("channelDelete", ({server: guild}) => !!server ? client.emit("CountUpdate", server, ["channel-count"]) : null);

client.on("commandRun", (cmd, asyncResult, msg, args) => {
  if(!msg.guild) return;
  if(!config[msg.guild]["command-log"] || msg.member.roles.cache.array()[0].name === "Owner") return;
  client.channels.cache.get(config[msg.guild]["command-log"]).send(
    (new MessageEmbed())
    .setTitle("Command Log")
    .setDescription(`Someone used a command with a role of ${msg.member.roles.cache.array()[0].toString()}.`)
    .addField("User:", msg.author.toString(), true)
    .addField("Command:", `\`${msg.content}\``, true)
    .addField("Channel:", msg.channel.toString(), true)
    .setColor("RANDOM")
    .setTimestamp()
  );
});

client.on("messageUpdate", (msg_old, msg_new) => {
  if(!msg_old.guild || !config[msg_old.guild.id]["chat-edit-log"]) return;
  const channel = msg_old.guild.channels.cache.get(config[msg_old.guild.id]["chat-edit-log"]);
  
});

client.on("messageReactionAdd", async (reaction, user) => {
  if(!reaction.message.guild) return;
  for(const reactionRole of reaction["reaction-roles"]) {
    if(user.id === client.user.id) break;
    if(!reactionRole.channel.equals(reaction.message.channel)) continue;
    if(reactionRole.message.id !== reaction.message.id) continue;
    if(reactionRole.emoji.identifier !== reaction.emoji.identifier) continue;
    let message = await reaction.message.channel.messages.fetch(reaction.message.id);
    let role = reactionRole.role;
    if(message.guild.member(user).roles.cache.has(role.id) || !message) break;
    await message.guild.member(user).roles.add(role);
  }
});
client.on("messageReactionRemove", async (reaction, user) => {
  if(!reaction.message.guild) return;
  for(const reactionRole of client["reaction-roles"]) {
    if(user === client.user) break;
    if(!reactionRole.channel.equals(reaction.message.channel)) continue;
    if(reactionRole.message.id !== reaction.message.id) continue;
    if(reactionRole.emoji.identifier !== reaction.emoji.identifier) continue;
    let message = await reaction.message.channel.messages.fetch(reaction.message.id);
    let role = reactionRole.role;
    if(!message.guild.member(user).roles.cache.has(role.id) || !message) break;
    await message.guild.member(user).roles.remove(role);
  }
});

client.on("CountUpdate", (server, change) => {
  const counts = {
    "member-count": server.members.cache.size,
    "user-count": server.members.cache.array().filter(e => !e.user.bot).length,
    "bot-count": server.members.cache.array().filter(e => e.user.bot).length,
    "role-count": server.roles.cache.size,
    "channel-count": server.channels.cache.size
  };
  for(let countname in counts) {
    if(!!config[server.id][countname] && change.includes(countname)) server.channels.cache.get(config[server.id][countname]).setName(server.channels.cache.get(config[server.id][countname]).name.replace(/(<n>|\d+)/g, counts[countname]));
  }
});

try {client.login(process.env.DISCORD_TOKEN)}
catch(e) {console.info("Discord Bot can't be connected!")}