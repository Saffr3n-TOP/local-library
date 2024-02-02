const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema(
  {
    name: { type: String, min: 3, max: 100, required: true },
  },
  { collection: "genres" }
);

GenreSchema.virtual("url").get(function () {
  return `/genre/${this.id}`;
});

module.exports = mongoose.model("Genre", GenreSchema);
