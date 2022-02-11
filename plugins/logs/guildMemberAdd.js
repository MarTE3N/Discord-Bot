const {MessageEmbed} = require("discord.js");

module.exports.help = {
    type: "event",
    name: "guildMemberAdd"
}
module.exports.run = async (client, guildConfig, member) => {
    if (!(guildConfig.logs || guildConfig.logs.members)) return

    let channel = member.guild.channels.cache.get(guildConfig.logs.members)

    if (channel === undefined ||
        channel.type !== 'GUILD_TEXT'
    ) return

    const embed = new MessageEmbed()
        .setColor("#19e304")
        .setTimestamp()
        .setFooter({text: "Joined: "})
        .setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL()})
        .setDescription(`<@!${member.user.id}> - **${member.user.id}**\n\nAccount created: <t:${Math.round(+new Date(member.user.createdTimestamp)/1000)}>`)
    channel.send({embeds: [embed]})
}
