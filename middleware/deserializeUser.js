import lodash from "lodash";
const get = lodash.get;
import { reIssueAccessToken } from "../service/session.service.js";
import { verifyJwt } from "../utils/jwt.utils.js";
import logger from "../utils/logger.js";

const deserializeUser = async (req, res, next) => {
  let accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accessToken) {
    accessToken = req.cookies.accessToken;
  }

  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    logger.info("jwt expired");
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.cookie("accessToken", newAccessToken, {
        secure: false,
        httpOnly: true,
      });
      res.setHeader("x-access-token", newAccessToken);
    } else {
      return next();
    }

    const result = verifyJwt(newAccessToken);
    res.locals.user = result.decoded;
    return next();
  }
  return next();
};

export default deserializeUser;
