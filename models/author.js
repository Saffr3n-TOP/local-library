const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const AuthorSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, maxLenght: 100 },
    last_name: { type: String, required: true, maxLenght: 100 },
    date_of_birth: Date,
    date_of_death: Date,
  },
  { collection: "authors" }
);

AuthorSchema.virtual("name").get(function () {
  let name = "";

  name += this.first_name || "";
  name && (name += " ");
  name += this.last_name || "";

  return name;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

AuthorSchema.virtual("url").get(function () {
  return `/author/${this.id}`;
});

module.exports = mongoose.model("Author", AuthorSchema);
