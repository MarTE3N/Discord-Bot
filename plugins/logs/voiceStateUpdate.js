const {MessageEmbed} = require("discord.js");

module.exports.help = {
    type: "event",
    name: "voiceStateUpdate"
}
module.exports.run = async (client, guildConfig, oldState, newState) => {
    if (oldState.channel === null && newState.channel === null ||
        oldState.channel === newState.channel ||
        !(guildConfig.logs || guildConfig.logs.voiceStates) ||
        !newState.member
    ) return;

    let channel = newState.guild.channels.cache.get(guildConfig.logs.voiceStates)

    if (channel === undefined ||
        channel.type !== 'GUILD_TEXT'
    ) return

    const embed = new MessageEmbed()
        .setTimestamp()
        .setAuthor({name: newState.member.user.tag, iconURL:newState.member.user.displayAvatarURL()})

    if (!oldState.channelId && newState.channelId && !oldState.channel && newState.channel){
        embed.setColor("#ca09ea")
        embed.setFooter({text: "Join: "})
        embed.setTitle(`${newState.member.user.tag} joined the channel`)
        embed.setDescription(`Has joined the channel: \n<#${newState.channel.id}> (${newState.channel.name})`)
    }
    else if (oldState.channelId && !newState.channelId && oldState.channel && !newState.channel){
        embed.setColor("#ff0000")
        embed.setFooter({text: "Leave: "})
        embed.setTitle(`${newState.member.user.tag} left the channel`)
        embed.setDescription(`Has left the channel: \n<#${oldState.channel.id}> (${oldState.channel.name})`)
    }
    else if (oldState.channelId && newState.channelId && oldState.channel && newState.channel){
        embed.setColor("#0088d2")
        embed.setFooter({text: "Change: "})
        embed.setTitle(`${newState.member.user.tag} changed the Channel`)
        embed.setDescription(`He's changed the channel from \n<#${oldState.channel.id}> (${oldState.channel.name})\nto\n<#${newState.channel.id}> (${newState.channel.name})`)
    }
    channel.send({embeds: [embed]})
}
