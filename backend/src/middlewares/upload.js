const fs = require('fs');
const path = require('path');
const multer = require('multer');

const MAX_COVER_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const coversDir = path.join(__dirname, '../../uploads/blog-covers');

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    fs.mkdirSync(coversDir, { recursive: true });
    cb(null, coversDir);
  },
  filename(req, file, cb) {
    const originalExt = path.extname(file.originalname || '').toLowerCase();
    const extension = originalExt || '.jpg';
    const safeBaseName = path
      .basename(file.originalname || 'cover', originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'cover';

    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniquePrefix}-${safeBaseName}${extension}`);
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
