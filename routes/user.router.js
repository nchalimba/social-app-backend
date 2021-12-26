import express from "express";
import bcrypt from "bcrypt";
import requireUser from "../middleware/requireUser.js";
import logger from "../utils/logger.js";
import {
  deleteUser,
  findAndUpdateUser,
  findUser,
} from "../service/user.service.js";
import { findPosts } from "../service/post.service.js";
const router = express.Router();
import lodash from "lodash";

// get current user
router.get("/current", requireUser, async (req, res) => {
  const userId = res.locals.user;
  const user = await findUser({ _id: userId });
  res.status(200).json(lodash.omit(user, "password"));
});
//update user
router.put("/:id", requireUser, async (req, res) => {
  const user = res.locals.user;
  if (user._id !== req.params.id && !user.isAdmin) {
    res.status(403).json("You can only update your account");
    return;
  }
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
      return;
    }
  }
  try {
    await findAndUpdateUser({ _id: req.params.id }, req.body, {
      new: true,
    });
    res.status(200).json("Account has been updated");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});
//delete user

router.delete("/:id", requireUser, async (req, res) => {
  const user = res.locals.user;
  if (user._id !== req.params.id && !user.isAdmin) {
    res.sendStatus(403);
    return;
  }
  try {
    await deleteUser({ _id: req.params.id });
    res.status(200).json("Account has been deleted");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get user

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  console.log(req.query);
  const username = req.query.username;
  try {
    const query = userId ? { _id: userId } : { username };
    console.log(query);
    const user = await findUser(query);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const posts = await findPosts({ userId: user._id });
    user.amountPosts = posts?.length || 0;
    res
      .status(200)
      .json(lodash.omit(user, "password", "updatedAt", "createdAt"));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get current user
router.get("/current", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const user = await findUser({ _id: userId });
    res
      .status(200)
      .json(lodash.omit(user, "password", "updatedAt", "createdAt"));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get followings
router.get("/friends", async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const user = await findUser({ _id: userId });
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return findUser({ _id: friendId });
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});
//follow a user

router.put("/:id/follow", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  if (userId === req.params.id) {
    res.status(403).json("You cannot follow yourself");
    return;
  }
  try {
    const user = await findUser({ _id: req.params.id });
    if (user.followers.includes(userId)) {
      res.status(204).json("You already follow this user");
      return;
    }
    await findAndUpdateUser(
      { _id: user._id },
      { $push: { followers: userId } }
    );
    await findAndUpdateUser(
      { _id: userId },
      { $push: { following: req.params.id } }
    );
    res.status(200).json("user has been followed");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});
//unfollow a user
router.put("/:id/unfollow", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  if (userId === req.params.id) {
    res.status(403).json("You cannot unfollow yourself");
    return;
  }
  try {
    const user = await findUser({ _id: req.params.id });
    if (!user.followers.includes(userId)) {
      res.status(204).json("You do not follow this user");
      return;
    }
    await findAndUpdateUser(
      { _id: user._id },
      { $pull: { followers: userId } }
    );
    await findAndUpdateUser(
      { _id: userId },
      { $pull: { following: req.params.id } }
    );
    res.status(200).json("user has been unfollowed");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});
export default router;
