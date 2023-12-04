const express = require("express");
const csvController = require("../controllers/csvController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   if (!fs.existsSync("public")) {
  //     fs.mkdirSync("public");
  //   }
  //
  //   if (!fs.existsSync("public/images")) {
  //     fs.mkdirSync("public/images");
  //   }
  //
  //   cb(null, "public/images");
  // },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    cb(null, Date.now().toString() + ext);
  },
});

// router.post("/create", csvController.create);

const router = express.Router();

const upload = multer({
  storage: storage,
});

router.post("/create", upload.single("file"), csvController.create);

//post create new media
router.post("/createByUrl", csvController.createByUrl);




module.exports = router;
