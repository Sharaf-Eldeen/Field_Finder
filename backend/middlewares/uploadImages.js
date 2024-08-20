const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/"),
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

function checkFileType(file, cb) {
  const allowedFileTypes = ["jpg", "jpeg", "png", "gif"];
  const fileType = file.mimetype.split("/")[1];
  if (allowedFileTypes.includes(fileType)) {
    cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).array("images", 10);

module.exports = upload;
