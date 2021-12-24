import { query } from "express";
import SessionModel from "../models/session.model.js";
import { verifyJwt, signJwt } from "../utils/jwt.utils.js";
import lodash from "lodash";
const get = lodash.get;
import { findUser } from "./user.service.js";

export const createSession = async (userId, userAgent) => {
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
};

export const findSession = async (query) => {
  return SessionModel.find(query).lean();
};

export const updateSession = async (query, update) => {
  return SessionModel.updateOne(query, update);
};

export const reIssueAccessToken = async ({ refreshToken }) => {
  const { decoded } = verifyJwt(refreshToken);
  if (!decoded || !get(decoded, "session")) return false;
  const session = await SessionModel.findById(get(decoded, "session"));
  if (!session || !session.valid) return false;
  const user = await findUser({ _id: session.user });
  if (!user) return false;

  const userObject = lodash.omit(user, "password");
  const accessToken = signJwt(
    { ...userObject, session: session._id },
    { expiresIn: process.env.ACCESS_TOKEN_TTL }
  );
  return accessToken;
};
