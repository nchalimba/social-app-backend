import express from "express";
import logger from "../utils/logger.js";
import { bucket } from "../utils/firebase.utils.js";

const router = express.Router();

router.get("/:filepath", async (req, res) => {
  try {
    const filepath = `social/${decodeURI(req.params.filepath)}`;
    const fileExtension = getFileExtension(filepath);

    const validExtensions = ["jpg", "jpeg", "png"];
    if (!validExtensions.includes(fileExtension)) {
      res.sendStatus(400);
      return;
    }

    res.setHeader("content-type", `image/${fileExtension}`);
    bucket
      .file(filepath)
      .createReadStream()
      .on("error", (error) => {
        handleError(error, res);
      })
      .pipe(res)
      .on("error", (error) => {
        handleError(error, res);
      });
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  const file = req.files?.file;
  const filename = req.body.name;
  const folder = req.body.folder;

  if (!file || !filename || !folder) {
    res.sendStatus(400);
    return;
  }
  try {
    //upload file
    const fileReference = bucket.file(`social/${folder}/${filename}`);
    await fileReference.save(file.data);
    res.status(200).json("The image has been saved successfully");
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

const handleError = (error, res) => {
  if (error.code === 404) {
    res.sendStatus(404);
    return;
  }
  logger.error(error);
  res.sendStatus(500);
};
const getFileExtension = (filepath) => {
  const elements = filepath.split(".");
  return elements[elements.length - 1];
};

export default router;
