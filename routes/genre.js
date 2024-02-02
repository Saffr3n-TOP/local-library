const genreController = require("../controllers/genre");
const express = require("express");
const router = express.Router();

// GET request for list of all genres
router.get("/list", genreController.genreList);

// GET request for creating genre
router.get("/create", genreController.genreCreateGet);

// POST request for creating genre
router.post("/create", genreController.genreCreatePost);

// GET request to delete genre
router.get("/:id/delete", genreController.genreDeleteGet);

// POST request to delete genre
router.post("/:id/delete", genreController.genreDeletePost);

// GET request to update genre
router.get("/:id/update", genreController.genreUpdateGet);

// POST request to update genre
router.post("/:id/update", genreController.genreUpdatePost);

// GET request for one genre
router.get("/:id", genreController.genreDetail);

module.exports = router;
