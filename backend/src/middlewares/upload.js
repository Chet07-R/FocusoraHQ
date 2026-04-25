const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const MAX_COVER_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const mimeTypeToFileExtension = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const blogCoversDirectory = path.join(__dirname, '../../uploads/blog-covers');
fs.mkdirSync(blogCoversDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    return cb(null, blogCoversDirectory);
  },
  filename(req, file, cb) {
    const extension = mimeTypeToFileExtension[file.mimetype] || 'bin';
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    return cb(null, fileName);
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: MAX_COVER_IMAGE_SIZE_BYTES },
  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error('Only JPG, PNG, WEBP, and GIF files are allowed');
      error.status = 400;
      error.code = 'INVALID_FILE_TYPE';
      return cb(error);
    }

    return cb(null, true);
  },
}).single('coverImageFile');

const uploadBlogCover = (req, res, next) => {
  uploader(req, res, (error) => {
    if (!error) {
      if (req.file?.filename) {
        req.uploadedCoverPath = `/uploads/blog-covers/${req.file.filename}`;
      }

      return next();
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      error.status = 400;
      error.code = 'FILE_TOO_LARGE';
      error.message = 'Cover image must be 2MB or smaller';
    }

    return next(error);
  });
};

module.exports = {
  uploadBlogCover,
};
