import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import userRoute from "./routes/user.router.js";
import authRoute from "./routes/auth.router.js";
import fileRoute from "./routes/file.router.js";
import commentRoute from "./routes/comment.router.js";
import conversationRoute from "./routes/conversation.router.js";
import messageRoute from "./routes/message.router.js";
import logger from "./utils/logger.js";
import deserializeUser from "./middleware/deserializeUser.js";
import postRoute from "./routes/post.router.js";
import cookieParser from "cookie-parser";
import path from "path";
import fileUpload from "express-fileupload";
import connect from "./utils/database.utils.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(deserializeUser);
app.use(helmet());
app.use(morgan("common"));
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("index.html");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);
app.use("/api/file", fileRoute);
app.use("/api/comment", commentRoute);

const port = process.env.PORT || 3000;
const server = app.listen(port, async () => {
  try {
    logger.info(`App is running at http://localhost:${port}`);
    await connect();
  } catch (error) {
    logger.error("Could not connect to DB");
    logger.error(error);
    logger.info("Stopping server...");
    server.close();
  }
});
