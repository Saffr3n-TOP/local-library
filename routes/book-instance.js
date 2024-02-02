const bookInstanceController = require("../controllers/book-instance");
const express = require("express");
const router = express.Router();

// GET request for list of all book instances
router.get("/list", bookInstanceController.bookInstanceList);

// GET request for creating book instance
router.get("/create", bookInstanceController.bookInstanceCreateGet);

// POST request for creating book instance
router.post("/create", bookInstanceController.bookInstanceCreatePost);

// GET request to delete book instance
router.get("/:id/delete", bookInstanceController.bookInstanceDeleteGet);

// POST request to delete book instance
router.post("/:id/delete", bookInstanceController.bookInstanceDeletePost);

// GET request to update book instance
router.get("/:id/update", bookInstanceController.bookInstanceUpdateGet);

// POST request to update book instance
router.post("/:id/update", bookInstanceController.bookInstanceUpdatePost);

// GET request for one book instance
router.get("/:id", bookInstanceController.bookInstanceDetail);

module.exports = router;
