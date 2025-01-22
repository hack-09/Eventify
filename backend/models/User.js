/**
 * UserSchema: Defines the structure for storing user data in the MongoDB database.
 * This schema includes fields to store user information like name, email, and password.
 */

const mongoose = require('mongoose');

// Define the schema for users
const UserSchema = new mongoose.Schema(
    {
        /**
         * @property {String} name - The full name of the user.
         * Required field.
         */
        name: { type: String, required: true },

        /**
         * @property {String} email - The email address of the user.
         * Required field. Must be unique.
         */
        email: { type: String, required: true, unique: true },

        /**
         * @property {String} password - The password for the user's account.
         * Required field. Stored securely in the database.
         */
        password: { type: String, required: true },
    },
    {
        /**
         * Timestamps: Automatically adds `createdAt` and `updatedAt` fields to the schema.
         */
        timestamps: true,
    }
);

// Export the User model for use in other parts of the application
module.exports = mongoose.model('User', UserSchema);
