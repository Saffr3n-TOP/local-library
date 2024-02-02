const authorController = require("../controllers/author");
const express = require("express");
const router = express.Router();

// GET request for list of all authors
router.get("/list", authorController.authorList);

// GET request for creating author
router.get("/create", authorController.authorCreateGet);

// POST request for creating author
router.post("/create", authorController.authorCreatePost);

// GET request to delete author
router.get("/:id/delete", authorController.authorDeleteGet);

// POST request to delete author
router.post("/:id/delete", authorController.authorDeletePost);

// GET request to update author
router.get("/:id/update", authorController.authorUpdateGet);

// POST request to update author
router.post("/:id/update", authorController.authorUpdatePost);

// GET request for one author
router.get("/:id", authorController.authorDetail);

module.exports = router;
