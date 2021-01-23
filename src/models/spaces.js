
const mongoose= require('mongoose');

const spaceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    image:{
        type:String,
        required: true
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId, //giving reference to the user ID
        ref:'User'
    }],
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]
})



const Spaces = mongoose.model('Space',spaceSchema);
module.exports = Spaces;
