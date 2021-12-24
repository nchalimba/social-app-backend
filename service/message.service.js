import MessageModel from "../models/message.model.js";

export const createMessage = async (input) => {
  try {
    const message = await MessageModel.create(input);
    return message.toJSON();
  } catch (error) {
    throw new Error(error);
  }
};

export const findMessage = async (query) => {
  return MessageModel.findOne(query).lean();
};

export const findAndUpdateMessage = async (query, update, options) => {
  return MessageModel.findOneAndUpdate(query, update, options);
};

export const deleteMessage = async (query) => {
  return MessageModel.deleteOne(query);
};

export const findMessages = async (query) => {
  return MessageModel.find(query);
};
