const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, './uploads'),
    
    filename: function (req, file, cb) {
        console.log(path.extname(file.originalname))
        cb(
            null,
            file.fieldname + '-' + Math.round(Math.random() * 19) + path.extname(file.originalname)
        );
    }
});

const upload = multer({ storage});

module.exports = upload;