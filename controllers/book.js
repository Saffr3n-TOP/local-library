const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Book = require("../models/book");
const BookInstance = require("../models/book-instance");
const Author = require("../models/author");
const Genre = require("../models/genre");

// Display list of all books
exports.bookList = asyncHandler(async (req, res, next) => {
  const books = await Book.find()
    .select("title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();

  res.render("book-list", { title: "Book List", books });
});

// Display detail page for a specific book
exports.bookDetail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (!book) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("book-detail", {
    title: book.title,
    book,
    bookInstances,
  });
});

// Display book create form on GET
exports.bookCreateGet = asyncHandler(async (req, res, next) => {
  const [authors, genres] = await Promise.all([
    Author.find().sort({ last_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("book-form", {
    title: "Create Book",
    authors,
    genres,
  });
});

// Handle book create on POST
exports.bookCreatePost = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [authors, genres] = await Promise.all([
        Author.find().sort({ last_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of genres) {
        if (book.genre.includes(genre.id)) {
          genre.checked = "true";
        }
      }
      return res.render("book-form", {
        title: "Create Book",
        authors,
        genres,
        book,
        errors: errors.array(),
      });
    }

    await book.save();
    res.redirect(book.url);
  }),
];

// Display book delete form on GET
exports.bookDeleteGet = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).exec(),
    BookInstance.find({ book: req.params.id }, "imprint").exec(),
  ]);

  if (!book) {
    res.redirect("/book/list");
  }

  res.render("book-delete", {
    title: "Delete Book",
    book,
    bookInstances,
  });
});

// Handle book delete on POST
exports.bookDeletePost = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).exec(),
    BookInstance.find({ book: req.params.id }, "imprint").exec(),
  ]);

  if (bookInstances.length > 0) {
    return res.render("book-delete", {
      title: "Delete Book",
      book,
      bookInstances,
    });
  }

  await Book.findByIdAndDelete(req.body.id);
  res.redirect("/book/list");
});

// Display book update form on GET
exports.bookUpdateGet = asyncHandler(async (req, res, next) => {
  const [book, authors, genres] = await Promise.all([
    Book.findById(req.params.id).populate("author").exec(),
    Author.find().sort({ last_name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  if (!book) {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  genres.forEach((genre) => {
    if (book.genre.includes(genre.id)) genre.checked = "true";
  });

  res.render("book-form", {
    title: "Update Book",
    authors,
    genres,
    book,
  });
});

// Handle book update on POST
exports.bookUpdatePost = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      const [authors, genres] = await Promise.all([
        Author.find().sort({ last_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of genres) {
        if (book.genre.indexOf(genre.id) > -1) {
          genre.checked = "true";
        }
      }

      return res.render("book-form", {
        title: "Update Book",
        authors,
        genres,
        book,
        errors: errors.array(),
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {});
    res.redirect(updatedBook.url);
  }),
];
