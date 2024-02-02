const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const BookInstanceSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    imprint: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Available", "Maintenance", "Loaned", "Reserved"],
      default: "Maintenance",
    },
    due_back: { type: Date, default: Date.now },
  },
  { collection: "book-instances" }
);

BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

BookInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.due_back).toISODate();
});

BookInstanceSchema.virtual("url").get(function () {
  return `/book-instance/${this.id}`;
});

module.exports = mongoose.model("BookInstance", BookInstanceSchema);
