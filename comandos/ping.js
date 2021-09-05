module.exports={
    name:'ping',
    description: "Command ini digunakan untuk Ping",
    execute(message, args){
        message.channel.send(`🏓mi ping es de ${Date.now() - message.createdTimestamp}ms`);
        }
      };