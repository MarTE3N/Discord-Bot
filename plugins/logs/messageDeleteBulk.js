const {MessageEmbed} = require("discord.js");

module.exports.help = {
    type: "event",
    name: "messageDeleteBulk"
}
module.exports.run = async (client, guildConfig, messages) => {

    if ((!guildConfig.logs || !guildConfig.logs.message)) return
    let channel_db = client.channels.cache.get(guildConfig.logs.message)

    if (channel_db === undefined ||
        channel_db.type !== 'GUILD_TEXT'
    ) return

    let length = messages.size();
    let channel = messages.first().channel.name;

    const embed = new MessageEmbed()
        .setColor("#f63232")
        .setTimestamp()
        .setFooter({text: "Deleted: "})
        .setTitle(`Deleted ${length} messages on ${channel}`)
        .setDescription(messages.map(message => `[${message.author.tag}]: ${message.content} ${message.embeds.length !== 0 ? "**(EMBED)**" : " "}`).join("\n"))

    try{
        channel_db.send({embeds: [embed]})
    }catch{
        channel_db.send({embeds: [new MessageEmbed()
                .setColor("#f63232")
                .setTimestamp()
                .setFooter("Deleted:")
                .setTitle(`Deleted ${length} messages on ${channel}`)]})
    }
}
