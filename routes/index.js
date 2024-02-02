const Author = require("../models/author");
const BookInstance = require("../models/book-instance");
const Book = require("../models/book");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();

/* GET home page. */
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const [
      authorCount,
      bookInstanceCount,
      availableBookInstanceCount,
      bookCount,
      genreCount,
    ] = await Promise.all([
      Author.countDocuments().exec(),
      BookInstance.countDocuments().exec(),
      BookInstance.countDocuments({ status: "Available" }).exec(),
      Book.countDocuments().exec(),
      Genre.countDocuments().exec(),
    ]);

    res.render("index", {
      title: "Local Library",
      authorCount,
      bookInstanceCount,
      availableBookInstanceCount,
      bookCount,
      genreCount,
    });
  })
);

module.exports = router;
