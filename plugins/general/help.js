const {MessageEmbed} = require("discord.js");
const {color} = require("../../config");
module.exports.help = {
    name: "help",
    aliases: [],
}

module.exports.run = async (client, message, args, guildConfig) => {
    let embed = new MessageEmbed()
        .setColor(color)
        .setTitle('Help')
    let category = []
    client.commands.filter(e => !e.help.permissions || message.member.permissions.toArray().includes(e.help.permissions)).map(e => {
        if (!category[e.help.category]) category[e.help.category] = []
        category[e.help.category].push(e.help)
    })
    for (let e in category){
        if (category[e].length === 0) continue
        embed.addField(e, category[e].map(t => guildConfig.prefix+t.name).join(", "))
    }
    message.reply({embeds: [embed]})
}