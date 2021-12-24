import mongoose from "mongoose";

import logger from "./logger.js";

async function connect() {
  const dbUri = process.env.MONGO_URL;
  await mongoose.connect(dbUri);
  logger.info("Connected to DB");
}

export default connect;
