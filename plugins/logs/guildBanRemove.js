const {MessageEmbed} = require("discord.js");

module.exports.help = {
    type: "event",
    name: "guildBanRemove"
}
module.exports.run = async (client, guildConfig, ban) => {
    if ((!guildConfig.logs || !guildConfig.logs.members)) return

    let channel = ban.guild.channels.cache.get(guildConfig.members)

    if (channel === undefined ||
        channel.type !== 'GUILD_TEXT'
    ) return

    channel.send({embeds: [
        new MessageEmbed()
            .setColor("#018903")
            .setTimestamp()
            .setFooter({text: "Unbanned: "})
            .setAuthor({name: ban.user.tag, iconURL: ban.user.displayAvatarURL()})
            .setDescription(`<@${ban.user.id}> has been unbanned`)
    ]})
}
