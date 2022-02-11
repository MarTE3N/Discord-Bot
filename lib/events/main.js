const {MessageEmbed} = require("discord.js");
module.exports.event_send = async function(type, event_args, guildId, client) {
    if (!guildId) return

    let t = client.events.get(type)
    if (!t && type !== "messageCreate") return

    let guildConfig = await client.db.getGuild(guildId)
    if (type === "messageCreate"){
        CommandHandler(client, guildConfig, event_args.arg_one)
    }
    if (!t) return
    t.map(e => {
        e(client, guildConfig, event_args.arg_one, event_args.arg_two ? event_args.arg_two : "")
    })
}

const config = require('../../config')
const {colors_log} = require("../function/main");
const CommandHandler = async (client, guildConfig, message) => {
    let prefix
    let mentionRegex = message.content.match(new RegExp(`^<@!?(${client.user.id})>`, "gi"));
    if (mentionRegex) prefix = `${mentionRegex[0]}`;
    else prefix = guildConfig.prefix


    if (!message.content.startsWith(prefix)) return
    if (!guildConfig) throw new Error('❌ Error in Command Handler')

    let args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase();

    if (!cmd && mentionRegex) {
        await message.reply({
            embeds: [new MessageEmbed().setTitle(client.user.username).setDescription(`Prefix: ${guildConfig.prefix}`).setColor(config.color).addField("MarTE3N", "[Github](https://github.com/MarTE3N)")],
        })
    }
    let command;
    if (!message.guild) return;
    if (cmd.length === 0) return
    if (client.commands.has(cmd)) command = client.commands.get(cmd);
    else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));

    if (!command) return message.react(config.emoji_deny)
    if (command.help.enabled === false) return message.react(config.emoji_deny)

    if (command.help.permissions !== undefined && !message.member.permissions.toArray().includes(command.help.permissions)) {
        await message.react(config.emoji_deny)
        return message.reply({
            embeds: [new MessageEmbed().setColor(config.color_deny).setDescription(`<a:deny:${config.emoji_deny}> You do not have sufficient privileges to use the **${command.help.name}** command`)],
            allowedMentions: {repliedUser: false}
        })
    }

    command.run(client, message, args, guildConfig);
    console.log(`${colors_log.fg.green}[${new Date()}] || ${message.author.tag} (${message.author.id}) use ${command.help.name} in ${message.guildId}${colors_log.reset}`)
}