require('dotenv').config()

const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const path = require("path");
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')
const ImageModel = require("./models/image-model");

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);

// app.use("/public", express.static(path.join(__dirname, "public")));

app.get('/images/:id', async (req, res) => {
    try {
        const image = await ImageModel.findById(req.params.id);
        res.contentType(image.contentType);
        res.send(image.data);
    } catch (error) {
        res.status(404).send('Image not found');
    }
});

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e){
    }
}

start();
