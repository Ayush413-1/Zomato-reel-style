const express = require("express");
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Add Comment
router.post(
    "/",
    authMiddleware.authUserMiddleware,
    commentController.addComment
);

// Get all comments of a reel
router.get(
    "/:foodId",
    authMiddleware.authUserMiddleware,
    commentController.getComments
);

// Delete comment
router.delete(
    "/:commentId",
    authMiddleware.authUserMiddleware,
    commentController.deleteComment
);

router.put("/:commentId", 
    authMiddleware.authUserMiddleware, 
    commentController.editComment
);

module.exports = router;