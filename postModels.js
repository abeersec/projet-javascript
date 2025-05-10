const { timeStamp } = require('console');
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

    title:{
        type: String,
        required: [true, 'Le titre est requis !'], 
        trim: true,
    },
    description:{  
        type: String,
        required: [true, 'La description est requise !'],
        trim: true,
    },
    userId:{   
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
    },{timestamps: true})

    module.exports = mongoose.model('Post', postSchema)
