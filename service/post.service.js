import PostModel from "../models/post.model.js";

export const createPost = async (input) => {
  try {
    const post = await PostModel.create(input);
    return post.toJSON();
  } catch (error) {
    throw new Error(error);
  }
};

export const findPost = async (query) => {
  return PostModel.findOne(query).lean();
};

export const findAndUpdatePost = async (query, update, options) => {
  return PostModel.findOneAndUpdate(query, update, options);
};

export const deletePost = async (query) => {
  return PostModel.deleteOne(query);
};

export const findPosts = async (query) => {
  return PostModel.find(query);
};
