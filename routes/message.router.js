import express from "express";
import requireUser from "../middleware/requireUser.js";
import { findConversation } from "../service/conversation.service.js";
import { createMessage, findMessages } from "../service/message.service.js";
import logger from "../utils/logger.js";

const router = express.Router();

//create new message
router.post("/", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  const { conversationId, text } = req.body;

  try {
    const conversation = await findConversation({ _id: conversationId });
    if (!conversation?.members?.includes(userId)) {
      res.sendStatus(403);
      return;
    }
    const message = await createMessage({
      sender: userId,
      text,
      conversationId,
    });
    res.status(200).json(message);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

//get all messages for specified conversation id
router.get("/:conversationId", requireUser, async (req, res) => {
  const userId = res.locals.user._id;
  const conversationId = req.params.conversationId;
  try {
    //validate if user is inside conversation
    const conversation = await findConversation({ _id: conversationId });

    if (!conversation?.members?.includes(userId)) {
      res.sendStatus(403);
      return;
    }
    const messages = await findMessages({ conversationId });
    res.status(200).json(messages);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

export default router;
