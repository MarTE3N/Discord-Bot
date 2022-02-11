const { connect } = require("mongoose");

GuildSchema = require('./schema/guilds')

const mongo = async () => {
    await connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('✅ Connected to database')
    }).catch((err) => {
        console.log('❌ Could not connect to the database.\nError: ' + err)
    })
}
mongo().catch(err => console.error(err))

module.exports.getGuild = async (_id, create=true) => {
    let guild = await GuildSchema.findById(_id)
    if (guild) return guild
    if (create) {
        guild = new GuildSchema({
            _id,
            prefix: ".",
            administration_roles: [],
            logs: {
                voiceStates: null,
                message: null,
                members: null,
            },
            complaints: {
                from_channel: null,
                to_channel: null,
                webhook: null
            },
        })
        await guild.save()
        return guild
    } else return null
}
