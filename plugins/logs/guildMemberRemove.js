const {MessageEmbed} = require("discord.js");

module.exports.help = {
    type: "event",
    name: "guildMemberRemove"
}
module.exports.run = async (client, guildConfig, member) => {
    if (!(guildConfig.logs || guildConfig.logs.members)) return

    let channel = member.guild.channels.cache.get(guildConfig.logs.members)

    if (channel === undefined ||
        channel.type !== 'GUILD_TEXT'
    ) return

    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
    });
    const audit_log = fetchedLogs.entries.first();
    channel.send({embeds: [
            new MessageEmbed()
                .setColor("#ff4141")
                .setTimestamp()
                .setFooter({text: audit_log && Date.now() - audit_log.createdTimestamp < 5000 ? "Kicked:" : "Leave:"})
                .setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL()})
                .setDescription(`<@${member.user.id}> `+ (audit_log && Date.now() - audit_log.createdTimestamp < 5000 ? `was kick out by: ${audit_log.executor.tag}` : "left the server") +
                    (member.roles.cache.length >= 1 ? `\n**Roles:** \n${member.roles.cache.filter(e => e.id !== member.guild.id).map(m => "<@&"+m.id+">").join(" \n")}` : "")
                )
        ]})
}
