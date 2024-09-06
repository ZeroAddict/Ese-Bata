const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

// Create connection
const conn = mongoose.createConnection('mongodb://localhost:27017/database');

// Initialize GridFS storage engine
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('images');
});

// Create a storage engine for multer
const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/database',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `image-${Date.now()}.${file.mimetype.split('/')[1]}`;
      const imgDetails = {
        filename: filename,
        bucketName: 'images'
      };
      resolve(imgDetails);
    });
  }
});

const upload = multer({ storage });

// Image upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const image = await gfs.files.findOne({ filename: req.file.filename });
    res.send(image);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Image retrieval
router.get('/image/:id', async (req, res) => {
  try {
    const image = await gfs.files.findOne({ _id: ("http://localhost:3000/image/_id") });
    //use imageSchema instead of local
    const readStream = gfs.createReadStream(image.filename);
    readStream.pipe(res);
  } catch (error) {
    res.status(400).send(error);
  }
});