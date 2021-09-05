//Musica
const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./util/EvobotUtil");
const i18n = require("i18n");


const client = new Client({
  disableMentions: "everyone",
  restTimeOffset: 0
});

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

i18n.configure({
  locales: ["ar", "de", "en", "es", "fr", "it", "ko", "nl", "pl", "pt_br", "ru", "sv", "th", "tr", "vi", "zh_cn", "zh_sg", "zh_tw"],
  directory: join(__dirname, "locales"),
  defaultLocale: "en",
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  logWarnFn: function (msg) {
    console.log("warn", msg);
  },

  logErrorFn: function (msg) {
    console.log("error", msg);
  },

  missingKeyFn: function (locale, value) {
    return value;
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  client.user.setActivity(`${PREFIX}help and ${PREFIX}play`, { type: "LISTENING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name })
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(i18n.__("common.errorCommand")).catch(console.error);
  }
});


client.on("ready", () => {
  let statuses = [
  `${client.guilds.cache.size} servidores`,
  `tr!help`,
  `como poner musica`
  //y pones tantas cosas como quieras
  ]
  setInterval(function(){
  let status = statuses[Math.floor(Math.random() *  statuses.length)];
  client.user.setActivity(status, {type: "WATCHING"});
  },30000 )//tiempo que quieres poner esta en milisegundos
  });

client.on("message", msg => {
  if (msg.content.includes("tr!")){
      console.log(msg.content)
  }

   if (msg.content === "tr!help") {
   const pruebaEmbed = new Discord.MessageEmbed()
   .setColor('GOLD')
   .setTitle('Mis comandos')
   .addField("tr!ping", `Con este comando puedes ver el ping del bot.`)
   .addField("tr!invite", `Con este comando puedes invitar al bot a tu servidor.`)
   .addField("tr!bot", `Con este comando puedes ver la informacion del bot`)
   .addField("tr!afk", `Con este comando puedes entrar en estado de AFK`)
   .addField("Necesitas mas ayuda?", `Unete al servidor de soporte del bot! https://discord.gg/dHS62NcMsq`)
   msg.channel.send(pruebaEmbed);
   }
  if (msg.content === "ping") {
     msg.reply("pong");
}

  if (msg.content === 'tr!bot') {
      const botEmbed = new Discord.MessageEmbed()
      .setTitle("soy un bot simple en creacion")
      .setColor('0x00ffff')
      .addField("puede que tenga algun fallo", `en ese caso contacta con trecto#2007`)
      msg.channel.send(botEmbed);
  }
  if (msg.content == 'tr!') {
     msg.channel.send(`${msg.author} usa tr!help para ver los comandos`);
  }
  if (msg.content === 'tr!invite') {
      const inviteEmbed = new Discord.MessageEmbed()
      .setTitle("me quieres invitar a un server?")
      .setColor('0x00ffff')
      .setDescription("https://discord.com/api/oauth2/authorize?client_id=883626883617554434&permissions=8&scope=bot")
      msg.channel.send(inviteEmbed);
;
  }
  
  if (msg.content === 'tr!profile') {
          //estado del user
  let pstatus = {
      "online": "Conectado",
      "offline": "Desconectado",
      "dnd": "No molestar",
      "idle": "Ausente"
      
     
  }
  let usuario = msg.mentions.members.first() || msg.member;
  const profileEmbed = new Discord.MessageEmbed()


  profileEmbed.setColor('GOLD')
  profileEmbed.addField("nombre:", `${usuario.user.username}`)
  profileEmbed.setImage(usuario.user.displayAvatarURL())
  profileEmbed.addField(`Estado`, `${pstatus[usuario.presence.status]}`)
  //profileEmbed.addField(`Roles`, `${usuario.roles.map(m => m).join("**|**")}`)
  msg.channel.send(profileEmbed);

  }
  if (msg.content === "tr!ping") {
      let ping = Date.now() - msg.createdTimestamp
      const pingEmbed = new Discord.MessageEmbed()
      .setColor('GOLD')
      .setTitle('PONG!')
      .setDescription(`🏓 Mi ping es de ${ping} ms.`);
      msg.channel.send(pingEmbed);
      }
      
});
