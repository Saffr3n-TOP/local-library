const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Author = require("../models/author");
const Book = require("../models/book");

// Display list of all authors
exports.authorList = asyncHandler(async (req, res, next) => {
  const authors = await Author.find().sort({ last_name: 1 }).exec();
  res.render("author-list", { title: "Author List", authors });
});

// Display detail page for a specific author
exports.authorDetail = asyncHandler(async (req, res, next) => {
  const [author, booksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (!author) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author-detail", {
    title: `Author ${author.name}`,
    author,
    booksByAuthor,
  });
});

// Display author create form on GET
exports.authorCreateGet = (req, res) => {
  res.render("author-form", { title: "Create Author" });
};

// Handle author create on POST
exports.authorCreatePost = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const author = new Author({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      return res.render("author-form", {
        title: "Create Author",
        author,
        errors: errors.array(),
      });
    }

    await author.save();
    res.redirect(author.url);
  }),
];

// Display author delete form on GET
exports.authorDeleteGet = asyncHandler(async (req, res, next) => {
  const [author, booksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (!author) {
    res.redirect("/author/list");
  }

  res.render("author-delete", {
    title: "Delete Author",
    author,
    booksByAuthor,
  });
});

// Handle author delete on POST
exports.authorDeletePost = asyncHandler(async (req, res, next) => {
  const [author, booksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (booksByAuthor.length > 0) {
    return res.render("author-delete", {
      title: "Delete Author",
      author,
      booksByAuthor,
    });
  }

  await Author.findByIdAndDelete(req.body.id);
  res.redirect("/author/list");
});

// Display author update form on GET
exports.authorUpdateGet = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id).exec();

  if (!author) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author-form", {
    title: "Update Author",
    author,
  });
});

// Handle author update on POST
exports.authorUpdatePost = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const author = new Author({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      return res.render("author-form", {
        title: "Update Author",
        author,
        errors: errors.array(),
      });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      author,
      {}
    );
    res.redirect(updatedAuthor.url);
  }),
];
