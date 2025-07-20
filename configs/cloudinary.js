const cloudinary = require('cloudinary').v2;



    // Configuration
    cloudinary.config({ 
        cloud_name: 'dk7uzygr4', 
        api_key: '225423515475565', 
        api_secret: '1ekonDbTKpTFsB2d5g0Z61W0tMU' // Click 'View API Keys' above to copy your API secret
    });

    module.exports = cloudinary;