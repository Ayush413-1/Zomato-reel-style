const mongoose = require("mongoose");
const { applyTimestamps } = require("./food.model");

const commentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    food:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    },
    text:{
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps : true
}
);

const commentModel = mongoose.model("comment",commentSchema);

module.exports = commentModel;