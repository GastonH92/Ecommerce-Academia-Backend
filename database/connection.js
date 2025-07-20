const mongoose = require('mongoose');

let connected = false;

const connection = async () => {
    if (connected === true) {
        console.log('Ya estás conectado');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI , {
            
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        connected = true;
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log('Error al conectar a MongoDB:', error);
    }
};


module.exports = connection;
