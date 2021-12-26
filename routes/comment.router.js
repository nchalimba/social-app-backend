import express from "express";
import {
  createComment,
  findComment,
  findComments,
} from "../service/comment.service.js";
import logger from "../utils/logger.js";
import requireUser from "../middleware/requireUser.js";
import { findAndUpdatePost, findPost } from "../service/post.service.js";
import { findUser } from "../service/user.service.js";

const router = express.Router();

//create comment
router.post("/", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  const { text, postId } = req.body;

  try {
    const post = await findPost({ _id: postId });
    if (!post) {
      res.sendStatus(404);
      return;
    }
    const comment = await createComment({ userId, text });
    await findAndUpdatePost(
      { _id: postId },
      { $push: { comments: comment._id } }
    );
    res.status(200).json(comment);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//find comment by id
router.get("/:id", requireUser, async (req, res) => {
  try {
    const comment = await findComment({ _id: req.params.id });
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {}
});

//find comments by post id
router.get("/", requireUser, async (req, res) => {
  const postId = req.query.postId;
  if (!postId) {
    res.sendStatus(400);
    return;
  }
  //get post
  try {
    const post = await findPost({ _id: postId });
    if (!post) {
      res.sendStatus(404);
      return;
    }
    const commentIds = post.comments;
    const comments = await findComments({ _id: { $in: commentIds } });
    if (!comments) {
      res.sendStatus(404);
      return;
    }

    //populate comments with user data
    const payload = await Promise.all(
      comments.map(async (comment) => {
        const { profilePicture, username } = await findUser({
          _id: comment.userId,
        });
        return { profilePicture, username, ...comment._doc };
      })
    );

    res.status(200).json(payload);
  } catch (error) {}
});

export default router;
