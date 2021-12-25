const mongoose = require("mongoose")
const { Schema } = mongoose
const autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost:27017/nodejjang");
autoIncrement.initialize(connection);

const comment = new Schema(
	{
		comment_content: { type: String, required: true },
		comment_target_id: { type: String, required: true },
		user_id: { type: String, required: true, index: true },
		created_at: { type: Date, required: true },
        archived: { type: Number, required: true},
        archived_at: { type: Date, required: true}
	},
	{ timestamps: true }
);

comment.plugin(autoIncrement.plugin, {
    model: '_id',
    field: 'id',
    startAt: 0,
    increment: 1
})

module.exports = mongoose.model('Comment', comment);