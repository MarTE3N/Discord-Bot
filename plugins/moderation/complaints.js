const { MessageEmbed } = require("discord.js");
const {color_deny, emoji_deny, color_approved, emoji_approved} = require("../../config");

module.exports.help = {
    type: "event",
    name: "messageCreate"
}
module.exports.run = async (client, guildConfig, message) => {
    function sendErrorMessage(content) {
        return message.channel.send({content: `<@!${message.author.id}>`,embeds: [
                new MessageEmbed()
                    .setColor(color_deny)
                    .setTitle(`<a:deny:${emoji_deny}> ${content}`)
            ]}).then(a => {
            setTimeout(() => {
                try{
                    a.delete();
                }catch {}
            }, 2000)
        })
    }

    if (message.author.bot ||
        !message.guild ||
        !(guildConfig.complaints || guildConfig.complaints.from_channel || guildConfig.complaints.to_channel) ||
        guildConfig.complaints.from_channel !== message.channel.id
    ) return


    message.delete()
    let member = message.mentions.members.first();
    if (
        member === undefined ||
        member.user.bot ||
        message.author.id === member.user.id
    ) return sendErrorMessage("Incorrect member")

    try {
        await message.author.send({
            embeds: [new MessageEmbed()
                .setColor(color_approved)
                .setDescription(`<a:approvedd:${emoji_approved}> Please state in one message with evidence what user **${member.user.tag}** did`)],
        })
    } catch{
        return sendErrorMessage("Unblock private messages, then re-write complaints")
    }
    let messageDM = await message.author.dmChannel.awaitMessages({filter: (t) => t.author.id === message.author.id, max: 1, time: 60000})
    if (messageDM.first() === undefined) return message.author.dmChannel.send({embeds: [
            new MessageEmbed()
                .setColor(color_deny)
                .setTitle(`<a:deny:${emoji_deny}> Sadly, time has run out`)]})

    messageDM = messageDM.first()

    if (messageDM.content === "cancel") return message.author.dmChannel.send({embeds: [
            new MessageEmbed()
                .setColor(color_deny)
                .setTitle(`<a:deny:${emoji_deny}> Complaint cancelled`)]})

    try{
        let channel = message.guild.channels.cache.get(guildConfig.complaints.to_channel)

        if (channel === undefined ||
            channel.type !== 'GUILD_TEXT') return

        const webhooks = await channel.fetchWebhooks();
        let webhook = webhooks.get(guildConfig.complaints.webhook)
        if (webhook === undefined) {
            webhook = await channel.createWebhook(client.user.tag, {
                avatar: client.user.displayAvatarURL(),
            })
            guildConfig.complaints.webhook = webhook.id
            guildConfig.save()
        }
        await webhook.send({
            embeds: [new MessageEmbed()
                .setColor("RANDOM")
                .setThumbnail(member.user.displayAvatarURL())
                .setDescription(`**Complaint**:\n ${messageDM.content}`)
                .addField(`─────────────`, `**Information about the confidant:**\n\n`+
                    `  **ID:** ${message.author.id}\n`+
                    `  **TAG:** ${message.author.tag}\n`+
                    `  **Joined the server:** <t:${Math.round(message.member.joinedTimestamp/1000)}>\n`+
                    `  **Role:** ${message.member.roles.cache.filter(e => e.id !== message.guild.id).map(e => `<@&${e.id}>`)}`
                )
                .addField(`─────────────`, `**Information about the suspect:**\n\n`+
                    `  **ID:** ${member.user.id}\n`+
                    `  **TAG:** ${member.user.tag}\n`+
                    `  **Joined the server:** <t:${Math.round(member.joinedTimestamp/1000)}>\n`+
                    `  **Role:** ${member.roles.cache.filter(e => e.id !== message.guild.id).map(e => `<@&${e.id}>`)}`
                )],
            files: [...messageDM.attachments.values()],
            username: message.author.tag,
            avatarURL: message.author.avatarURL()
        })
    }catch {}
}