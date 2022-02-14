const { MessageEmbed, Permissions } = require("discord.js");
const {emoji_deny, emoji_approve, administration_emoji, color, color_deny, color_approve} = require("../../config");
const {getRole} = require("../../lib/function/main");

module.exports.help = {
    name: "administration",
    aliases: ["adm"],
}
module.exports.run = async (client, message, args, guildConfig) => {
    if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        if (args[0]){
            let wrong_embed = new MessageEmbed()
                .setColor("#ee4846")
                .setTitle(`<a:deny:${emoji_deny}> Incorrect usage`)
                .setDescription(
                    `${guildConfig.prefix}adminstration add <role> <position> <nazwa>\n`+
                    `${guildConfig.prefix}adminstration remove <role>`
                )
            if (args[0] === "add")
            {
                if (!args[1] || !args[2] || !args[3]) return  message.reply({ embeds: [wrong_embed]})

                let role = getRole(message, args[1])
                
                if (role === undefined) return message.reply({ embeds: [wrong_embed]})

                guildConfig.administration_roles.push({position: args[2],roles: role.id, name: args.slice(3).join(' ')})
                await guildConfig.save()

                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(color_approve)
                        .setTitle(`<a:approved:${emoji_approve}> Success`)
                        .setDescription(`Correctly added role <@&${role.id}> to position ${args[2]} as an administrative role`)]
                })


            }else if (args[0] === "remove") {
                if (!args[1]) return  message.reply({ embeds: [wrong_embed]})
                let role = getRole(message, args[1])
                if (role === undefined) return message.reply({ embeds: [wrong_embed]})

                if (guildConfig.administration_roles.filter(e => e.roles === role.id).length <= 0) return message.reply({ embeds: [wrong_embed]})

                guildConfig.administration_roles = guildConfig.administration_roles.filter(e === e.roles !== role.id)

                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(color_approve)
                            .setTitle(`<a:approved:${emoji_approve}> Success`)
                            .setDescription(`Correctly removed role <@&${role.id}>`)
                    ]
                })
            }else{
                message.reply({
                    embeds: [wrong_embed]
                })
            }
        }
    }

    if(guildConfig.administration_roles.length === 0) return message.reply({
        embeds: [new MessageEmbed()
            .setColor(color_deny)
            .setTitle(`<a:deny:${emoji_deny}> Error`)
            .setDescription(`Command has not been configured by the administration`)]
    })
    let embed = new MessageEmbed()
        .setColor(color)
        .setTitle("Administration")
        .setThumbnail(message.guild.iconURL())

    guildConfig.administration_roles.sort(function(a, b){return a.position-b.position}).map(cnf => {
        let role = getRole(message, cnf.roles)
        if (role === undefined) return ""

        if (role.members.size === 0) return embed.addField(cnf.name, "Currently no one has this role")
        embed.addField(cnf.name, role.members.map(oh => {
            if (message.guild.members.cache.get(oh.id).presence === null){
                return `${administration_emoji["offline"]} <@!${oh.id}>`
            }
            return `${administration_emoji[message.guild.members.cache.get(oh.id).presence.status]} <@${oh.id}>`
        }).join("\n"))
    })
    return message.reply({
        embeds: [embed]
    })
}
