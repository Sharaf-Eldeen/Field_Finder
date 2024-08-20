const multer = require("multer");
const storage = require("./storageConfig");
const checkFileType = require("./fileTypeValidator");

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).array("images", 10);

module.exports = upload;
