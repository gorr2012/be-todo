const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskScheme = new Schema({
  message: String,
  complete: Boolean,
}, {versionKey: false});

module.exports = mongoose.model("Task", taskScheme);

export default interface TPagination {
  page: string,
  limit: string
}
