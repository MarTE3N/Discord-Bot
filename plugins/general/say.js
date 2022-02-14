const {MessageEmbed} = require("discord.js");
const {color_deny, emoji_deny} = require("../../config");
module.exports.help = {
    name: "say",
    aliases: [],
    permissions: "MESSAGE_SEND"
}

module.exports.run =  async (client, message, args) => {
    if (!args[0]) return message.reply({
        embeds: [new MessageEmbed() .setColor(color_deny) .setTitle(`<a:deny:${emoji_deny}> You cannot send an empty message`)]
    })
    message.channel.send({content: args.join(' '), allowedMentions: {}})
}