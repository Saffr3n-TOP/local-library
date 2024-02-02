const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const BookInstance = require("../models/book-instance");
const Book = require("../models/book");

// Display list of all book instances
exports.bookInstanceList = asyncHandler(async (req, res, next) => {
  const bookInstances = await BookInstance.find().populate("book").exec();

  res.render("book-instance-list", {
    title: "Book Instance List",
    bookInstances,
  });
});

// Display detail page for a specific book instance
exports.bookInstanceDetail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  if (!bookInstance) {
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("book-instance-detail", {
    title: "Book copy detail",
    bookInstance,
  });
});

// Display book instance create form on GET
exports.bookInstanceCreateGet = asyncHandler(async (req, res, next) => {
  const books = await Book.find({}, "title").sort({ title: 1 }).exec();

  res.render("book-instance-form", {
    title: "Create Book Instance",
    books,
  });
});

// Handle book instance create on POST
exports.bookInstanceCreatePost = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const books = await Book.find({}, "title").sort({ title: 1 }).exec();

      return res.render("book-instance-form", {
        title: "Create Book Instance",
        books,
        selectedBook: bookInstance.book,
        errors: errors.array(),
        bookInstance,
      });
    }

    await bookInstance.save();
    res.redirect(bookInstance.url);
  }),
];

// Display book instance delete form on GET
exports.bookInstanceDeleteGet = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id).exec();

  if (!bookInstance) {
    res.redirect("/book-instance/list");
  }

  res.render("book-instance-delete", {
    title: "Delete Book Instance",
    bookInstance,
  });
});

// Handle book instance delete on POST
exports.bookInstanceDeletePost = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id).exec();
  await BookInstance.findByIdAndDelete(req.body.id);
  res.redirect("/book-instance/list");
});

// Display book instance update form on GET
exports.bookInstanceUpdateGet = asyncHandler(async (req, res, next) => {
  const [bookInstance, books] = await Promise.all([
    BookInstance.findById(req.params.id).populate("book").exec(),
    Book.find().sort({ title: 1 }).exec(),
  ]);

  if (!bookInstance) {
    const err = new Error("Book instance not found");
    err.status = 404;
    return next(err);
  }

  res.render("book-instance-form", {
    title: "Update Book Instance",
    books,
    selectedBook: bookInstance.book.id,
    bookInstance,
  });
});

// Handle book instance update on POST
exports.bookInstanceUpdatePost = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      due_back: req.body.due_back,
      status: req.body.status,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      const books = await Book.find().sort({ title: 1 }).exec();

      return res.render("book-instance-form", {
        title: "Update Book",
        books,
        selectedBook: bookInstance.book,
        bookInstance,
        errors: errors.array(),
      });
    }

    const updatedBookInstance = await BookInstance.findByIdAndUpdate(
      req.params.id,
      bookInstance,
      {}
    );
    res.redirect(updatedBookInstance.url);
  }),
];
