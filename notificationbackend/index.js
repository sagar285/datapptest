const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;

const app = express();

// Configure MongoDB connection
mongoose.connect('mongodb+srv://sagardeveloperfullstack:fKMBXHZX01fQDR6m@cluster0.a8rrn0k.mongodb.net/testawsdataapp', {
  useUnifiedTopology: true,
}).then(()=>(
    console.log("connection succesfull")
));
// 
// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: 'AKIAXDSGBYONW4CKXHOL',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Define the data schema
const dataSchema = new mongoose.Schema({
  text: String,
  image: String,
  video: String,
  audio: String,
});

const Data = mongoose.model('Data', dataSchema);

// Handle POST request for data upload
app.post('/upload', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
]), async (req, res) => {
  try {
    const { text } = req.body;
    const imageFile = req.files['image']?.[0];
    const videoFile = req.files['video']?.[0];
    const audioFile = req.files['audio']?.[0];

    // Upload files to AWS S3
    const imageUrl = await uploadToS3(imageFile);
    const videoUrl = await uploadToS3(videoFile);
    const audioUrl = await uploadToS3(audioFile);

    // Save data to MongoDB
    const data = new Data({
      text,
      image: imageUrl,
      video: videoUrl,
      audio: audioUrl,
    });
    await data.save();

    res.status(200).json({ message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to upload file to AWS S3
const uploadToS3 = async (file) => {
  if (!file) return null;

  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuid()}.${fileExtension}`;

  const params = {
    Bucket: 'dataappbucket',
    Key: fileName,
    Body: file.buffer,
  };

  await s3.upload(params).promise();

  return `https://dataappbucket.s3.amazonaws.com/${fileName}`;
};

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});