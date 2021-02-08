const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    content: {
        type:String,
    },
    tagNames: {
        type: [String],
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dateNum: {
        type: Number,
        required: true,
    },
    tagIds: [
        {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Space",
            type: [String],
            required: true,
        },
    ],

}, { timestamps: true })


const Blogs = mongoose.model('Blog', blogSchema);

module.exports =  Blogs ;