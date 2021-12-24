import { query } from "express";
import lodash from "lodash";

import UserModel from "../models/user.model.js";

export const createUser = async (input) => {
  try {
    const user = await UserModel.create(input);
    return lodash.omit(user.toJSON(), "password");
  } catch (error) {
    throw new Error(error);
  }
};

export const findUser = async (query) => {
  return UserModel.findOne(query).lean();
};

export const findAndUpdateUser = async (query, update, options) => {
  return UserModel.findOneAndUpdate(query, update, options);
};

export const deleteUser = async (query) => {
  return UserModel.deleteOne(query);
};
