// Importing needed modules and JSON data
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

// Sync the models with the database and force drop any existing tables
const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    // Creates users in database, uses individual hooks to hash passwords, and returns users for later use
    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    // Creates posts in database
    const posts = await Post.bulkCreate(postData);

    // Loops through comments to create comments for posts
    for (const comment of commentData) {
        await Comment.create({
            ...comment,
            userId: users[Math.floor(Math.random() * users.length)].id,
            postId: posts[Math.floor(Math.random() * posts.length)].id,
        });
    }

    process.exit(0);
};

seedDatabase();
