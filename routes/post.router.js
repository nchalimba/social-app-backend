import express from "express";
import {
  createPost,
  findPost,
  findAndUpdatePost,
  deletePost,
  findPosts,
} from "../service/post.service.js";
import logger from "../utils/logger.js";
import requireUser from "../middleware/requireUser.js";
import { findUser } from "../service/user.service.js";
const router = express.Router();
const tmpUserId = "61a37f87672aa6a5aa424a71";

//create post
router.post("/", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const post = await createPost({ userId, ...req.body });
    res.status(200).json(post);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});
//update post
router.put("/:id", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const post = await findPost({ _id: req.params.id });
    if (!post) {
      res.sendStatus(404);
      return;
    }
    if (post.userId !== userId) {
      res.status(403).json("You cannot update this post");
      return;
    }
    await findAndUpdatePost({ _id: req.params.id }, req.body);
    res.status(200).json("Post has been updated");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//delete post
router.delete("/:id", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const post = await findPost({ _id: req.params.id });
    if (!post) {
      res.sendStatus(404);
      return;
    }
    if (post.userId !== userId) {
      res.status(403).json("You cannot delete this post");
      return;
    }
    await deletePost({ _id: req.params.id });
    res.status(200).json("Post has been deleted");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});
//like / dislike post
router.put("/:id/like", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const post = await findPost({ _id: req.params.id });
    if (!post) {
      res.sendStatus(404);
      return;
    }
    if (post.likes.includes(userId)) {
      await findAndUpdatePost(
        { _id: req.params.id },
        { $pull: { likes: userId } }
      );
      res.status(200).json("Post has been disliked");
      return;
    }
    await findAndUpdatePost(
      { _id: req.params.id },
      { $push: { likes: userId } }
    );
    res.status(200).json("Post has been liked");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//mark / unmark post
router.put("/:id/bookmark", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const post = await findPost({ _id: req.params.id });
    if (!post) {
      res.sendStatus(404);
      return;
    }
    if (post.bookmarks?.includes(userId)) {
      await findAndUpdatePost(
        { _id: req.params.id },
        { $pull: { bookmarks: userId } }
      );
      res.status(200).json("Post has been unmarked");
      return;
    }
    await findAndUpdatePost(
      { _id: req.params.id },
      { $push: { bookmarks: userId } }
    );
    res.status(200).json("Post has been marked");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get timeline posts
router.get("/timeline", requireUser, async (req, res) => {
  let postArray = [];
  const userId = res.locals.user._id;
  //const userId = tmpUserId;
  try {
    const currentUser = await findUser({ _id: userId });
    const userPosts = await findPosts({ userId: userId });
    if (currentUser.following?.length == 0) {
      res.status(200).json(userPosts);
      return;
    }
    const followerPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return findPosts({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...followerPosts));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//explore --> get all posts
router.get("/explore", requireUser, async (req, res) => {
  try {
    const posts = await findPosts({});
    res.status(200).json(posts);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get liked posts
router.get("/liked", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const posts = await findPosts({ likes: userId });
    res.status(200).json(posts);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get marked posts
router.get("/bookmarked", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const posts = await findPosts({ bookmarks: userId });
    res.status(200).json(posts);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get a post
router.get("/:id", requireUser, async (req, res) => {
  try {
    const post = await findPost({ _id: req.params.id });
    if (post) {
      res.status(200).json(post);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "CastError") {
      res.sendStatus(400);
    } else {
      logger.error(error);
      res.sendStatus(500);
    }
  }
});

//get all posts of user
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await findUser({ username: req.params.username });
    const posts = await findPosts({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

export default router;
