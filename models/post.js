const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  post_text: { type: String, required: true, maxLength: 3000 },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  timestamp: { type: Date, required: true, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, default: false },
});

// Virtual for post's URL
PostSchema.virtual("url").get(function () {
  return `/posts/${this._id}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
