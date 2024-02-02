const bookController = require("../controllers/book");
const express = require("express");
const router = express.Router();

// GET request for list of all books
router.get("/list", bookController.bookList);

// GET request for creating book
router.get("/create", bookController.bookCreateGet);

// POST request for creating book
router.post("/create", bookController.bookCreatePost);

// GET request to delete book
router.get("/:id/delete", bookController.bookDeleteGet);

// POST request to delete book
router.post("/:id/delete", bookController.bookDeletePost);

// GET request to update book
router.get("/:id/update", bookController.bookUpdateGet);

// POST request to update book
router.post("/:id/update", bookController.bookUpdatePost);

// GET request for one book
router.get("/:id", bookController.bookDetail);

module.exports = router;
