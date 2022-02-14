const {MessageEmbed} = require("discord.js");

module.exports.help = {
    type: "event",
    name: "messageUpdate"
}
module.exports.run = async (client, guildConfig, oldMessage, newMessage) => {
    if (oldMessage.channel.type !== "GUILD_TEXT" ||
        newMessage.channel.type !== "GUILD_TEXT" ||
        oldMessage.content.trim() === newMessage.content.trim() ||
        oldMessage.content === null ||
        newMessage.content === null ||
        !guildConfig.logs || !guildConfig.logs.message
    ) return

    let channel = newMessage.guild.channels.cache.get(guildConfig.logs.message)

    if (channel === undefined ||
        channel.type !== 'GUILD_TEXT'
    ) return
    const embed = new MessageEmbed()
        .setColor("#c26c3e")
        .setTimestamp()
        .setFooter({text: "Edited: "})
        .setAuthor({name: newMessage.member.user.tag, iconURL: newMessage.member.user.displayAvatarURL()})
        .setTitle(`Message edited on ${newMessage.channel.name}`)

    try{
        embed.setDescription(
            `An earlier version of the message:\n \`\`\`${oldMessage.content.replace(/`/g, "'")}\`\`\` \n`+
            `Revised version of the message:\n \`\`\`${newMessage.content.replace(/`/g, "'")}\`\`\``
        )
        channel.send({embeds: [embed]})
    }
    catch {
        embed.setDescription(
            `An earlier version of the message:\n \`\`\`${oldMessage.content.replace(/`/g, "'")}\`\`\` \n`
        )
        channel.send({embeds: [embed]})
    }

}
