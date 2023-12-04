const express = require("express");
const csvController = require("../controllers/csvController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    cb(null, Date.now().toString() + ext);
  },
});

const router = express.Router();

const upload = multer({
  storage: storage,
});

router.post("/create", upload.single("file"), csvController.create);

//post create new media
router.post("/createByUrl", csvController.createByUrl);




module.exports = router;
