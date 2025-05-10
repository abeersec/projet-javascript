// routes/questions.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Question = require('../models/Question');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

router.post('/add', upload.single('media'), async (req, res) => {
  try {
    const { type, statement, note, duration, answer, tolerance, options, correctAnswers } = req.body;

    const mediaPath = req.file ? req.file.filename : null;

    const newQuestion = new Question({
      type,
      statement,
      media: mediaPath,
      note,
      duration,
      ...(type === 'directe' && { answer, tolerance }),
      ...(type === 'qcm' && {
        options: JSON.parse(options),
        correctAnswers: JSON.parse(correctAnswers)
      })
    });
    console.log("Received body:", req.body);
    console.log("Uploaded file:", req.file);
    console.log("Prepared question:", newQuestion);

    await newQuestion.save();
    res.status(201).json({ message: 'Question saved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
