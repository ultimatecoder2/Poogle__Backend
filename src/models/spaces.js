
const mongoose= require('mongoose');

const spaceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId, //giving reference to the user ID
        ref:'User'
    }]
})



const Spaces = mongoose.model('Spaces',spaceSchema);
module.exports = Spaces;
