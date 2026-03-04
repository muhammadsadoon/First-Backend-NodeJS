import express from "express";
import { emailSenderController } from "../controller/email-sender-controller/email-sender-controller.js";
import multer from "multer";
import { fileUploaderConltroller } from "../controller/file-uploader-conltroller/file-uploader-conltroller.js";

const route = express.Router();

const multerUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "upload/")
        },
        filename: (req, file, cb) => {
            const uniqueFileName = Date.now() + '-' + file.originalname;
            cb(null, uniqueFileName)
        }
    }),
    limits: {
        // limit applies to file size (in bytes) instead of text field size
        fileSize: 1024 * 1024 * 50 // 50MB
    }
})

// optional: middleware to handle multer errors explicitly
function multerErrorHandler(err, req, res, next) {
    if (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ status: false, message: err.message });
        }
        return res.status(500).send({ status: false, message: "Unknown upload error" });
    }
    next();
}

route.route("/send/email").post(emailSenderController);


route.route("/upload/file").post(multerUpload.single("image"), fileUploaderConltroller)

export default route;