const {MessageEmbed} = require("discord.js");
const {getChannel} = require("../../lib/function/main");

module.exports.help = {
    type: "event",
    name: "guildBanAdd"
}
module.exports.run = async (client, guildConfig, ban) => {
    if ((!guildConfig.logs || !guildConfig.logs.members)) return

    let channel = getChannel(ban, guildConfig.logs.members)

    if (channel === undefined ||
        channel.type !== 'GUILD_TEXT'
    ) return

    const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD',
    });
    const audit_log = fetchedLogs.entries.first();

    channel.send({embeds: [
        new MessageEmbed()
            .setColor("#ff4141")
            .setTimestamp()
            .setFooter({text: "Banned: "})
            .setAuthor({name: ban.user.tag, iconURL: ban.user.displayAvatarURL()})
            .setDescription(`<@${ban.user.id}> ` +
                (audit_log && Date.now() - audit_log.createdTimestamp < 5000 ? `was banned by ${audit_log.executor.tag}` : "has been banned"))
    ]})
}
