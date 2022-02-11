const {model, Schema} = require("mongoose");

module.exports = model("guilds", new Schema ({
    _id: String,
    prefix: String,
    administration_roles: [{position: Number, roles: String, name: String}],
    logs: {
        voiceStates: String,
        message: String,
        members: String,
    },
    complaints: {
        from_channel: String,
        to_channel: String,
        webhook: String
    },
}))