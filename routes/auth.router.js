import express from "express";
import UserModel from "../models/user.model.js";
import { createSession, updateSession } from "../service/session.service.js";
import { signJwt } from "../utils/jwt.utils.js";
import logger from "../utils/logger.js";
import lodash from "lodash";
import { createUser } from "../service/user.service.js";
import requireUser from "../middleware/requireUser.js";

const router = express.Router();
//Register
router.post("/register", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    logger.error(error);
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json("user not found");
      return;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      res.sendStatus(401);
      return;
    }

    const userObject = lodash.omit(user.toJSON(), "password");
    const session = await createSession(
      userObject._id,
      req.get("user-agent") || ""
    );
    const accessToken = signJwt(
      { ...userObject, session: session._id },
      { expiresIn: process.env.ACCESS_TOKEN_TTL }
    );

    const refreshToken = signJwt(
      { ...userObject, session: session._id },
      { expiresIn: process.env.REFRESH_TOKEN_TTL }
    );
    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    logger.error(error);
    res.status(500);
  }
});

router.post("/logout", requireUser, async (req, res) => {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.sendStatus(200);
});
export default router;
