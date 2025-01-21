const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // From Cloudinary Dashboard
    api_key: process.env.CLOUDINARY_API_KEY,       // From Cloudinary Dashboard
    api_secret: process.env.CLOUDINARY_API_SECRET, // From Cloudinary Dashboard
});

cloudinary.uploader.destroy('events/njdwya3hb8elecfghnzh')
  .then((result) => {
    console.log('Image deleted successfully:', result);
  })
  .catch((error) => {
    console.error('Error deleting image:', error);
  });
