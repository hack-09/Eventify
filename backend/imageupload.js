const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // From Cloudinary Dashboard
    api_key: process.env.CLOUDINARY_API_KEY,       // From Cloudinary Dashboard
    api_secret: process.env.CLOUDINARY_API_SECRET, // From Cloudinary Dashboard
});

cloudinary.uploader.upload("./timemanagement.png"
, { folder: 'events' })
  .then((result) => {
    console.log('Image uploaded successfully:', result);
  })
  .catch((error) => {
    console.error('Error uploading image:', error);
  });
