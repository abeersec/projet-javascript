const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: String,
  description: String,
  targetAudience: String,
  uniqueLink: String,
});

module.exports = mongoose.model('Exam', examSchema);
