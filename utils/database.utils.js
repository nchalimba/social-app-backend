import mongoose from "mongoose";

import logger from "./logger.js";

async function connect() {
  const dbUri = process.env.MONGO_URL;
  await mongoose.connect(dbUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    keepAlive: true,
  });
  logger.info("Connected to DB");
}

export default connect;
