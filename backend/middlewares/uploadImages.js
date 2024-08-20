function checkFileType(file, cb) {
  const allowedFileTypes = ["jpg", "jpeg", "png", "gif"];
  const fileType = file.mimetype.split("/")[1];
  if (allowedFileTypes.includes(fileType)) {
    cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

module.exports = checkFileType;
