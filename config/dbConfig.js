

const express = require('express');
const app = express();
const mongoose = require("mongoose");
MONGO_URL="mongodb://127.0.0.1:27017/Healthify"


mongoose.connect(MONGO_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB connection is successful");
});

connection.on("error", (error) => {
  console.log("Error in MongoDB connection", error);
});

module.exports = mongoose;