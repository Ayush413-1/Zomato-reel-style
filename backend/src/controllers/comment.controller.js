const commentModel = require("../models/comment.model");
const foodModel = require("../models/food.model");

async function addComment(req, res) {
    try {

        const { foodId, text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const comment = await commentModel.create({
            user: req.user._id,
            food: foodId,
            text
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { commentCount: 1 }
        });

        const populatedComment = await commentModel
            .findById(comment._id)
            .populate("user", "fullName email")
            .lean();

        if (populatedComment?.user && typeof populatedComment.user === 'object') {
            populatedComment.userName = populatedComment.user.fullName || "User";
        }

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}


async function getComments(req, res) {
    try {

        const { foodId } = req.params;

        const comments = await commentModel
            .find({ food: foodId })
            .populate("user", "fullName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            comments
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

async function deleteComment(req, res) {
    try {

        const { commentId } = req.params;

        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        await commentModel.findByIdAndDelete(commentId);

        await foodModel.findByIdAndUpdate(comment.food, {
            $inc: { commentCount: -1 }
        });

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

// Edit Comment
async function editComment(req, res) {
    try {

        const { commentId } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Only comment owner can edit
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        comment.text = text;
        await comment.save();

        const updatedComment = await commentModel
            .findById(comment._id)
            .populate("user", "fullName email");

        res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    addComment,
    getComments,
    editComment,
    deleteComment
};