﻿# -file_uploads


handle file uploads and store their details in a MongoDB database in the context of an API instead of an HTML form, you can do so with a few modifications. Here's how you can adapt the Node.js code to work with API requests for file uploads:

Modified Node.js Server (app.js):

javascript

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

// Enable CORS for API requests (if needed)
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Handle file upload as an API endpoint
app.post('/api/upload', upload.array('documents'), async (req, res) => {
    try {
        const files = req.files;
        const savedFileDetails = [];
        for (const file of files) {
            // Save file details to MongoDB
            const newFile = new File({
                name: file.originalname,
                type: file.mimetype,
                data: file.buffer
            });
            await newFile.save();
            savedFileDetails.push({
                name: file.originalname,
                type: file.mimetype,
            });
        }
        res.json({ message: 'Files uploaded successfully', files: savedFileDetails });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading files' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
In this modified code:

We've added a new API endpoint at /api/upload to handle file uploads as API requests.
We enable Cross-Origin Resource Sharing (CORS) for API requests to allow requests from different origins. Adjust the CORS configuration as needed for your project's requirements.
Instead of sending an HTML response, we send JSON responses, including a success message and an array of saved file details.
Now, you can make POST requests to /api/upload with file data as part of the request, and the server will store the file details in the MongoDB database and respond with a JSON message.
