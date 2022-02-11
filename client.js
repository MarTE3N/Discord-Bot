const { Client, Intents, Collection} = require('discord.js')
require('dotenv').config()
const {readdirSync} = require("fs");
const {sep} = require("path");
const {event_send} = require("./lib/events/main");
const {colors_log} = require("./lib/function/main");

const client = new Client({
    autoReconnect: true,
    partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "USER"],
    allowedMentions: {repliedUser: false},
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});
client.db = require('./lib/database/main')
client.commands = new Collection()
client.events = new Collection()
client.aliases = new Collection()

const load_bot = async (dir = "./plugins/") => {
    for (const dirs of readdirSync(dir)) {
        const events = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => !files.startsWith("config_")).filter(files => files.endsWith(".js"));

        for (const file of events) {
            const pull = require(`${dir}/${dirs}/${file}`);
            if (pull.help && pull.help.type === "event") {
                if(pull.help.name !== undefined && pull.run !== undefined){
                    let t = client.events.get(pull.help.name)
                    if (!t) {
                        client.events.set(pull.help.name, [pull.run])
                        continue
                    }
                    t.push(pull.run)
                    client.events.set(pull.help.name, t)
                }
            }else {
                if (pull.help && typeof (pull.help.name) === "string") {
                    if (client.commands.get(pull.help.name)) console.warn(`Two or more commands have the same name`);
                    pull.help.category = dirs
                    client.commands.set(pull.help.name, pull);
                } else {
                    console.error(`Error in command: ${dir}${dirs}/${file}.`)
                    continue;
                }
                if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
                    pull.help.aliases.forEach(alias => {
                        if (client.aliases.get(alias)) return console.warn(`Two or more commands have the same alias`)
                        client.aliases.set(alias, pull.help.name)
                    })
                }
            }
        }
    }
}
load_bot()

client.on("ready", async () => {
    client.user.setPresence({ activities: [{name: 'Discord bot'}], status: 'invisible' });
    console.log("Login in: "+client.user.tag)
})


client.on("channelCreate", channel => event_send("channelCreate",{arg_one: channel}, channel.guildId, client).catch(e => {throw new Error(e)}))
client.on("channelDelete", channel => event_send("channelDelete",{arg_one: channel}, channel.guildId, client).catch(e => {throw new Error(e)}))
client.on("channelUpdate", (oldChannel, newChannel) => event_send("channelUpdate",{arg_one:oldChannel, arg_two:newChannel}, newChannel.guildId, client).catch(e => {throw new Error(e)}))
client.on("guildBanAdd", ban => event_send("guildBanAdd",{arg_one:ban}, ban.guild.id, client).catch(e => {throw new Error(e)}))
client.on("guildBanRemove", ban => event_send("guildBanRemove",{arg_one:ban}, ban.guild.id, client).catch(e => {throw new Error(e)}))
client.on("guildMemberAdd", member => event_send("guildMemberAdd",{arg_one:member}, member.guild.id, client).catch(e => {throw new Error(e)}))
client.on("guildMemberRemove", member => event_send("guildMemberRemove",{arg_one:member}, member.guild.id, client).catch(e => {throw new Error(e)}))
client.on("guildMemberUpdate", (oldMember, newMember) => event_send("guildMemberUpdate",{arg_one:oldMember, arg_two:newMember}, newMember.guild.id, client).catch(e => {throw new Error(e)}))
client.on("interactionCreate", interaction => event_send("interactionCreate",{arg_one: interaction}, interaction.guild.id, client).catch(e => {throw new Error(e)}))
client.on('messageCreate', async message => event_send("messageCreate",{arg_one: message}, message.guildId, client).catch(e => {throw new Error(e)}))
client.on('messageDelete', async message => event_send("messageDelete",{arg_one: message}, message.guildId, client).catch(e => {throw new Error(e)}))
client.on('messageDeleteBulk', async messages => event_send("messageDeleteBulk",{arg_one: messages}, messages.first().guildId, client).catch(e => {throw new Error(e)}))
client.on('messageUpdate', async (oldMessage, newMessage) => event_send("messageUpdate",{arg_one: oldMessage, arg_two:newMessage}, newMessage.guildId, client).catch(e => {throw new Error(e)}))
client.on("apiRequest", request => console.log(`${colors_log.fg.cyan}[${request.method.toUpperCase()}] ${request.route}${colors_log.reset}`))


client.login(process.env.TOKEN).catch(err => {throw new Error(err)})
process.on('unhandledRejection', error =>  console.log(`${colors_log.fg.red}[${new Date()}] || Error: ${colors_log.reset} \n${error}\n`))