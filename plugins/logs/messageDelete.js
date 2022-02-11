const {MessageEmbed} = require("discord.js");

module.exports.help = {
    type: "event",
    name: "messageDelete"
}
module.exports.run = async (client, guildConfig, message) => {
    if (!message || message.partial ||
        typeof message.author === "undefined" ||
        message.author && message.author.bot === true ||
        message.channel && message.channel.type !== "GUILD_TEXT" ||
        !(guildConfig.logs || guildConfig.logs.message)
    ) return

    let channel = message.guild.channels.cache.get(guildConfig.logs.message)

    if (channel === undefined ||
        channel.type !== 'GUILD_TEXT'
    ) return

    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
    });
    const audit_log = fetchedLogs.entries.first();

    channel.send({embeds: [
            new MessageEmbed()
                .setColor("#ff0000")
                .setFooter({text: "Deleted: "})
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setTitle(`Message has been deleted on ${message.channel.name}`)
                .setDescription(
                    `Deleted message:\n \`\`\`${message.content.replace(/`/g, "'")}\`\`\`` +
                    ((audit_log && Date.now() - audit_log.createdTimestamp < 5000) ? `By **${audit_log?.executor.tag}**` : "")
                )
    ]})
}
