const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment_text: { type: String, required: true, maxLength: 300 },
  timestamp: { type: Date, required: true, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Virtual for comment's URL
CommentSchema.virtual("url").get(function () {
  return `/posts/comments/${this._id}`;
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);
