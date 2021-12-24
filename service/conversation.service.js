import ConversationModel from "../models/conversation.model.js";

export const createConversation = async (input) => {
  try {
    const conversation = await ConversationModel.create(input);
    return conversation.toJSON();
  } catch (error) {
    throw new Error(error);
  }
};

export const findConversation = async (query) => {
  return ConversationModel.findOne(query).lean();
};

export const findAndUpdateConversation = async (query, update, options) => {
  return ConversationModel.findOneAndUpdate(query, update, options);
};

export const deleteConversation = async (query) => {
  return ConversationModel.deleteOne(query);
};

export const findConversations = async (query) => {
  return ConversationModel.find(query);
};
