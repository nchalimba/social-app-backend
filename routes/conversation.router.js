import express from "express";
import requireUser from "../middleware/requireUser.js";
import {
  createConversation,
  findConversation,
  findConversations,
} from "../service/conversation.service.js";
import { findUser } from "../service/user.service.js";
import logger from "../utils/logger.js";

const router = express.Router();

//create a new conversation
router.post("/", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  const receiverId = req.body.receiverId;
  try {
    const receiver = await findUser({ _id: receiverId });
    if (!receiver) {
      res.sendStatus(400);
      return;
    }
    const existingConversation = await findConversation({
      $and: [
        { members: { $all: [userId, receiverId] } },
        { members: { $size: 2 } },
      ],
    });
    if (existingConversation) {
      res.status(200).json(existingConversation);
      return;
    }
    const conversation = await createConversation({
      members: [userId, receiverId],
    });
    res.status(200).json(conversation);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get conversations of user
router.get("/", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  try {
    const conversations = await findConversations({ $in: [userId] });
    if (!conversations) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(conversations);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

export default router;
