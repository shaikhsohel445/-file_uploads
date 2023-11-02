const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection setup
mongoose.connect('mongodb://localhost/document_upload', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a MongoDB model for file details
const fileSchema = new mongoose.Schema({
    name: String,
    type: String,
    data: Buffer
});
const File = mongoose.model('File', fileSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle file upload
app.post('/upload', upload.array('documents'), async (req, res) => {
    try {
        const files = req.files;
        for (const file of files) {
            // Save file details to MongoDB
            const newFile = new File({
                name: file.originalname,
                type: file.mimetype,
                data: file.buffer
            });
            await newFile.save();
        }
        res.send('Files uploaded successfully.');
    } catch (error) {
        res.status(500).send('Error uploading files.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
