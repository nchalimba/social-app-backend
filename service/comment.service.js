import CommentModel from "../models/comment.model.js";

export const createComment = async (input) => {
  const comment = await CommentModel.create(input);
  return comment.toJSON();
};

export const findComments = async (query) => {
  return CommentModel.find(query);
};

export const findComment = async (query) => {
  return CommentModel.findOne(query).lean();
};
