const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Upload folder
const uploadFolder = path.join(__dirname, "uploads");

// Create uploads folder if it does not exist
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage
});

// Serve HTML and CSS
app.use(express.static("public"));

// Upload file
app.post("/upload", upload.single("file"), (req, res) => {

    if (!req.file) {
        return res.send("Please select a file.");
    }

    res.redirect("/");
});

// Display files
app.get("/files", (req, res) => {

    fs.readdir(uploadFolder, (err, files) => {

        if (err) {
            return res.json([]);
        }

        res.json(files);
    });
});

// Download file
app.get("/download/:filename", (req, res) => {

    const filePath = path.join(
        uploadFolder,
        req.params.filename
    );

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.send("File not found");
    }
});

// Delete file
app.delete("/delete/:filename", (req, res) => {

    const filePath = path.join(
        uploadFolder,
        req.params.filename
    );

    if (fs.existsSync(filePath)) {

        fs.unlinkSync(filePath);

        res.json({
            message: "File deleted successfully"
        });

    } else {

        res.status(404).json({
            message: "File not found"
        });

    }
});

// Start server
app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
