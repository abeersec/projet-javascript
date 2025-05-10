const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }, // Link to the Exam model
  type: { type: String, required: true },
  statement: { type: String, required: true },
  media: { type: String }, // Path to media (if any)
  note: { type: Number, required: true },
  duration: { type: Number, required: true },
  answer: { type: String }, // Only for direct questions
  tolerance: { type: Number }, // Only for direct questions
  options: { type: [String] }, // Only for QCM questions
  correctAnswers: { type: [Number] } // Only for QCM questions
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
