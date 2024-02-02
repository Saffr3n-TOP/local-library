const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Genre = require("../models/genre");
const Book = require("../models/book");

// Display list of all genres
exports.genreList = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre-list", { title: "Genre List", genres });
});

// Display detail page for a specific genre
exports.genreDetail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).select("title summary").exec(),
  ]);

  if (!genre) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre-detail", {
    title: `Genre: ${genre.name}`,
    genre,
    booksInGenre,
  });
});

// Display genre create form on GET
exports.genreCreateGet = (req, res) => {
  res.render("genre-form", { title: "Create Genre" });
};

// Handle genre create on POST
exports.genreCreatePost = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      return res.render("genre-form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
    }

    const genreExists = await Genre.findOne({ name: req.body.name }).exec();
    if (genreExists) {
      res.redirect(genreExists.url);
    } else {
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];

// Display genre delete form on GET
exports.genreDeleteGet = asyncHandler(async (req, res, next) => {
  const [genre, booksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).exec(),
  ]);

  if (!genre) {
    res.redirect("/genre/list");
  }

  res.render("genre-delete", {
    title: "Delete Genre",
    genre,
    booksByGenre,
  });
});

// Handle genre delete on POST
exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  const [genre, booksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).exec(),
  ]);

  if (booksByGenre.length > 0) {
    return res.render("genre-delete", {
      title: "Delete Genre",
      genre,
      booksByGenre,
    });
  }

  await Genre.findByIdAndDelete(req.body.id);
  res.redirect("/genre/list");
});

// Display genre update form on GET
exports.genreUpdateGet = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  if (!genre) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre-form", {
    title: "Update Genre",
    genre,
  });
});

// Handle genre update on POST
exports.genreUpdatePost = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      return res.render("genre-form", {
        title: "Update Genre",
        genre,
        errors: errors.array(),
      });
    }

    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
    res.redirect(updatedGenre.url);
  }),
];
