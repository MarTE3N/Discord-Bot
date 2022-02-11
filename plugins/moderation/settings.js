const {MessageEmbed} = require("discord.js");
const {color_deny, emoji_deny, emoji_approve, color_approve} = require("../../config");
const {getChannel} = require("../../lib/function/main");
module.exports.help = {
    name: "settings",
    aliases: [],
    permissions: 'ADMINISTRATOR',
}
module.exports.run = async (client, message, args, guildConfig) => {
    let wrong_use = new MessageEmbed()
        .setColor(color_deny)
        .setTitle(`<a:deny:${emoji_deny}> Inccorect use`)
        .addField(` ${guildConfig.prefix}settings complaints <from_channel/to_channel> <channel>`, `❯ Complaints settings`, false)
        .addField(` ${guildConfig.prefix}settings logs <message/member/voice> <channel>`, `❯ Setting the logs `, false)
    if (!(args[0] || args[1])) return message.reply({embeds: [wrong_use]})

    if (args[0].toLowerCase() === "prefix") {
        if (guildConfig.prefix === args[1]){
            return message.reply({embeds: [new MessageEmbed() .setColor(color_deny) .setDescription(`<a:deny:${emoji_deny}> why are you trying to change the prefix to the current one`)]})
        }else {
            guildConfig.prefix = args[1]
            guildConfig.save()
            return message.reply({embeds: [new MessageEmbed() .setColor(color_approve) .setDescription(`<a:approve:${emoji_approve}> Zmieniłeś prefix na ${args[1]}`)]})
        }
    }

    if (!args[2]) return message.reply({embeds: [wrong_use]})
    if (args[0].toLowerCase() === "complaints") {
        if (args[1] === "from_channel") {
            let channel = getChannel(message, args[2])

            if (channel === undefined ||
                channel.type !== 'GUILD_TEXT'
            ) return message.reply({embeds: [wrong_use]})

            guildConfig.complaints.from_channel = channel.id
            guildConfig.save()
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(color_approve)
                    .setDescription(`<a:approved:${emoji_approve}> Set channel <#${channel.id}> as the channel for complaints`)],
                allowedMentions: {repliedUser: false}
            })
        }
        if (args[1] === "to_channel") {
            let channel = getChannel(message, args[2])

            if (channel === undefined ||
                channel.type !== 'GUILD_TEXT'
            ) return message.reply({embeds: [wrong_use]})

            guildConfig.complaints.to_channel = channel.id

            guildConfig.save()
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(color_approve)
                    .setDescription(`<a:approved:${emoji_approve}> Set channel <#${channel.id}> as the channel to send complaints`)],
                allowedMentions: {repliedUser: false}
            })
        }
        return message.reply({embeds: [wrong_use]})
    }

    else if (args[0].toLowerCase() === "logs") {
        let channel = getChannel(message, args[2])

        if (channel === undefined ||
            channel.type !== 'GUILD_TEXT'
        ) return message.reply({embeds: [wrong_use], allowedMentions: {repliedUser: false}})

        if (args[1].toLowerCase() === "message") {
            guildConfig.logs.message = channel.id
            guildConfig.save()
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(color_approve)
                    .setDescription(`<a:approved:${emoji_approve}> Set logs from messages on channel <#${channel.id}>`)],
                allowedMentions: {repliedUser: false}
            })
        }
        else if (args[1].toLowerCase() === "voice") {
            guildConfig.logs.voiceStates = channel.id
            guildConfig.save()
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(color_approve)
                    .setDescription(`<a:approved:${emoji_approve}> Set logs from voice chat on channel <#${channel.id}>.`)],
                allowedMentions: {repliedUser: false}
            })
        }
        else if (args[1].toLowerCase() === "member") {
            guildConfig.logs.members = channel.id
            guildConfig.save()
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(color_approve)
                    .setDescription(`<a:approved:${emoji_approve}> Set logs from a member on channel <#${channel.id}>.`)],
                allowedMentions: {repliedUser: false}
            })
        }
        else return message.reply({embeds: [wrong_use], allowedMentions: {repliedUser: false}})
    }
}