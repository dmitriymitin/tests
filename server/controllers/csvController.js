const https = require("https");
const fs = require("fs");
const ImageModel = require("../models/image-model");

// exports.create = async (req, res) => {
//   try {
//     console.log(req.file);
//     const image = req.file;
//
//     let imagePath = "";
//     if (image) {
//       imagePath = image.path;
//     }
//
//     res.json({
//       success: 1,
//       file: {
//         url: process.env.API_URL + `/${imagePath}`,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error);
//   }
// };

exports.create = async (req, res) => {
  try {
    const image = req.file;
    console.log(req)
    if (image) {
      const newImage = new ImageModel({
        data: fs.readFileSync(image.path),
        contentType: image.mimetype
      });
      await newImage.save();

      res.json({ success: 1, fileId: newImage._id });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.createByUrl = async (req, res) => {
  try {
    console.log(req.body);
    const { url } = req.body;

    const name = Date.now().toString();
    const imagePath = `public/urls/${name}.jpg`;
    const file = fs.createWriteStream(`./${imagePath}`);
    https.get(url, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        res.json({
          success: 1,
          file: {
            url: process.env.API_URL + `/${imagePath}`,
          },
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
