import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const s3 = new aws.S3({ 
  endpoint: process.env.S3_STORAGE_ENDPOINT,
  s3ForcePathStyle: true,
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY, 
})
 
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
  // console.log(file.mimetype);
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const multerS3Upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET as string,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

export { s3, multerS3Upload };