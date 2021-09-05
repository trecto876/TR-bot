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

const aafk = require('./afk.json')

client.on("message", msg => {
  if (typeof aafk[msg.author.id] != 'undefined') {
      if(msg.author.id == aafk[msg.author.id].uid){
          if (typeof aafk[msg.author.id].state != 'undefined') {
              if (aafk[msg.author.id].state == "AFK") {
          let fecha = new Date();
  var dia = fecha.getDay()
  var hora = fecha.getHours()
  var min = fecha.getMinutes()
  var sec = fecha.getSeconds()
  let jd = aafk[msg.author.id].day
  let jh = aafk[msg.author.id].hora
  let jmin = aafk[msg.author.id].min
  let jsec = aafk[msg.author.id].sec
  let td = `${Math.abs(dia - jd)}`
  let th = `${Math.abs(hora - jh)}`
  let tmin = `${Math.abs(min - jmin)}`
  let tsec = `${Math.abs(sec - jsec)}`
  
  aafk[msg.author.id] = {
      state: "noAFK"
  }
  fs.writeFile("./afk.json", JSON.stringify (aafk, null, 4), err => {
  if (err) throw err;
  });
  const embed = new Discord.MessageEmbed()
  .setTitle("ya no estas AFK")
  .addField("tiempo afk:", `${td} días, ${th} horas, ${tmin} minutos, ${tsec} segundos`)
  .setThumbnail(msg.author.avatarURL())
  .setFooter("Me alegra verte otra vez!")
  .setColor("GOLD")
  msg.channel.send(embed)
          }
          }
      }
  }
  if (msg.content === 'tr!afk') {
  let fecha = new Date();
  var dia = fecha.getDay()
  var hora = fecha.getHours()
  var scmin = fecha.getMinutes()
  var sec = fecha.getSeconds()
  if (scmin <= 9) {
  if (scmin == 0) {
  var min = 00
  }else if (scmin == 1) {
  var min = 01
  }else if (scmin == 2) {
  var min = 02
  }else if (scmin == 3) {
  var min = 03
  }else if (scmin == 4) {
  var min = 04
  }else if (scmin == 5) {
  var min = 05
  }else if (scmin == 6) {
  var min = 06
  }else if (scmin == 7) {
  var min = 07
  }else if (scmin == 8) {
  var min = 08
  }else if (scmin == 9) {
  var min = 09
  }
  }else { 
  var min = scmin
  }
  
  const embed = new Discord.MessageEmbed()
  .setTitle(`${msg.author.username}#${msg.author.discriminator}`)
  .addField("**AFK**", `sin motivo`)
  .setFooter("quien te mencione sera avisado!")
  .addField("hora", `${hora}:${min}`)
  .setColor("GOLD")
  .setThumbnail(msg.author.avatarURL())
  msg.channel.send(embed);
  
  aafk[msg.author.id] = {
  state: "AFK",
  uid: `${msg.author.id}`,
  un: `${msg.author.username}`,
  ud: `${msg.author.discriminator}`,
  why: "sin motivo",
  day: dia,
  hora: hora,
  min: min,
  sec: sec
  }
  fs.writeFile("./afk.json", JSON.stringify (aafk, null, 4), err => {
  if (err) throw err;
  });
  } else if (msg.content.startsWith('tr!afk')) {
  let causa = msg.content.replace("tr!afk", "")
  let fecha = new Date();
  var dia = fecha.getDay()
  var hora = fecha.getHours()
  var scmin = fecha.getMinutes()
  var sec = fecha.getSeconds()
  if (scmin <= 9) {
  if (scmin == 0) {
  var dmin = 00
  }else if (scmin == 1) {
  var dmin = 01
  }else if (scmin == 2) {
  var dmin = 02
  }else if (scmin == 3) {
  var dmin = 03
  }else if (scmin == 4) {
  var dmin = 04
  }else if (scmin == 5) {
  var dmin = 05
  }else if (scmin == 6) {
  var dmin = 06
  }else if (scmin == 7) {
  var dmin = 07
  }else if (scmin == 8) {
  var dmin = 08
  }else if (scmin == 9) {
  var dmin = 09
  }
  }else { 
  var dmin = scmin
  }
  
  const embed = new Discord.MessageEmbed()
  .setTitle(`${msg.author.username}#${msg.author.discriminator}`)
  .addField("**AFK**", `motivo: ${causa}`)
  .setFooter("quien te mencione sera avisado!")
  .addField("hora", `${hora}:${dmin}`)
  .setColor("GOLD")
  .setThumbnail(msg.author.avatarURL())
  msg.channel.send(embed);
  
  aafk[msg.author.id] = {
  state: "AFK",
  uid: `${msg.author.id}`,
  un: `${msg.author.username}`,
  ud: `${msg.author.discriminator}`,
  why: `${causa}`,
  day: dia,
  hora: hora,
  min: scmin,
  sec: sec
  }
  fs.writeFile("./afk.json", JSON.stringify (aafk, null, 4), err => {
  if (err) throw err;
  });
  }
  if (msg.content.includes("<@")){
      if (!msg.author.bot) {
          if (msg.content.includes("!"), msg.content.includes("&")) {
              console.log("en la mencion hay un ! o &")
          }else{
              if (typeof msg.mentions.users.first().id != 'undefined') {
                  var mencion = msg.mentions.users.first().id
              if (mencion == aafk[mencion]) {
              let fmencion = msg.mentions.users.first().avatarURL()
              let fecha = new Date();
              var dia = fecha.getDay()
              var hora = fecha.getHours()
              var min = fecha.getMinutes()
              var sec = fecha.getSeconds()
              let jd = aafk[mencion].day
              let jh = aafk[mencion].hora
              let jmin = aafk[mencion].min
              let jsec = aafk[mencion].sec
              var td = `${Math.abs(dia - jd)}`
              var rtd = td
              var th = `${Math.abs(hora - jh)}`
              var rth = th
              let tmin = `${Math.abs(min - jmin)}`
              let tsec = `${Math.abs(sec - jsec)}`
              if(rtd == 0) {
              if(rth == 0) {
              const embed = new Discord.MessageEmbed()
              .setTitle(`${aafk[mencion].un}#${aafk[mencion].ud}`)
              .addField("**AFK**", `${aafk[mencion].why}`)
              .setFooter("esta AFK")
              .addField("tiempo afk:", `${tmin} minutos, ${tsec} segundos`)
              .setThumbnail(fmencion)
              .setColor("GOLD")
              msg.channel.send(embed)
              } else {
              const embed = new Discord.MessageEmbed()
              .setTitle(`${aafk[mencion].un}#${aafk[mencion].ud}`)
              .addField("**AFK**", `${aafk[mencion].why}`)
              .setFooter("esta AFK")
              .addField("tiempo afk:", `${th} horas, ${tmin} minutos, ${tsec} segundos`)
              .setThumbnail(fmencion)
              .setColor("GOLD")
              msg.channel.send(embed)
              }
              }else {
              const embed = new Discord.MessageEmbed()
              .setTitle(`${aafk[mencion].un}#${aafk[mencion].ud}`)
              .addField("**AFK**", `${aafk[mencion].why}`)
              .setFooter("esta AFK")
              .addField("tiempo afk:", `${td} días, ${th} horas, ${tmin} minutos, ${tsec} segundos`)
              .setThumbnail(fmencion)
              .setColor("GOLD")
              msg.channel.send(embed)
              }
              }
              }
              }
      }
  
      
  }
})