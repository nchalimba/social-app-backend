import lodash from "lodash";
const get = lodash.get;
import { reIssueAccessToken } from "../service/session.service.js";
import { verifyJwt } from "../utils/jwt.utils.js";

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
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
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
