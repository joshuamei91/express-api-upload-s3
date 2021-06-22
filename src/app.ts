import express from 'express';
import mongoose from 'mongoose';
import { s3, multerS3Upload } from './Controllers/multer.s3.upload';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(`mongodb://${process.env.MONGODB_URI}`, {
  useCreateIndex: true,
  useNewUrlParser: true
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome' });
});

const singleUpload = multerS3Upload.single('image');
app.post('/upload', 
  singleUpload,
  function(req, res, next) {
    res.send('Successfully uploaded ' + req.file.originalname);
  }
)

const signedUrlExpireSeconds = 60;
app.get("/presignedUrl/:key", function (req, res) {
  const key = req.params.key;
  const url = s3.getSignedUrl('getObject', {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Expires: signedUrlExpireSeconds
  })
  res.send(url);
});

export default app;