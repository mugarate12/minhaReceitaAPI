import dotenv from 'dotenv'
import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'
import crypto from 'crypto'
import aws from 'aws-sdk'

dotenv.config()
aws.config.update({
  region: process.env.AWS_DEFAULT_REGION
})
const s3 = new aws.S3()
const DESTINATION = path.resolve(__dirname, '..', '..', 'temp', 'uploads')
const randomHash = crypto.randomBytes(16)
const hashString = randomHash.toString('hex')

const storage = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DESTINATION)
    },
    filename: (req, file, cb) => {
      const randomHash = crypto.randomBytes(16)
      const hashString = randomHash.toString('hex')
      const key = `${hashString}-${file.originalname}`

      cb(null, key)
    }
  }),
  cloud: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME || '',
    acl: 'public-read',
    key: (req, file, cb) => {
      const key = `${hashString}-${file.originalname}`

      cb(null, key)
    }
  })
}

export default multer({
  storage: process.env.NODE_ENV === 'production' ? storage.cloud : storage.local,
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."))
    }
  },
})
