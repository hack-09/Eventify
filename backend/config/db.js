/**
 * Module to establish a connection with a MongoDB database using Mongoose.
 * This module exports the `connectDB` function, which connects to the database
 * using the connection URI provided in the environment variable `MONGO_URI`.
 */

const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction

/**
 * Asynchronous function to connect to the MongoDB database.
 * Uses the MONGO_URI environment variable to establish the connection.
 * @throws Will terminate the process if the connection fails.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB with the provided URI and options
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Ensures the use of the new URL parser to handle connection strings
            useUnifiedTopology: true, // Enables the new unified topology engine for better server discovery and monitoring
        });

        // Log a success message with the host of the connected database
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log an error message and terminate the process if the connection fails
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with a failure code
    }
};

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;
