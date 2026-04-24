const multer = require('multer');

const MAX_COVER_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const uploader = multer({
  storage: multer.memoryStorage(),
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
