import jwt from "jsonwebtoken";
import logger from "./logger.js";

export const signJwt = (object, options) => {
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyJwt = (token) => {
  try {
    const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
