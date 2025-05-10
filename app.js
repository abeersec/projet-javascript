const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const connectToDB = require('./config/db');
const express = require('express');



const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static('uploads'));console.log('MONGODB_URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));


app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/exams', examRoutes);
app.use('/api/posts', postsRouter);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

app.use('/api/questions', questionRoutes);

app.post('/api/exams/create', async (req, res) => {
  try {
    const { title, description, targetAudience } = req.body;
    const uniqueId = Math.random().toString(36).substring(2, 10); 
    const uniqueLink = `http://localhost:5500/exam/${uniqueId}`;

    const newExam = new Exam({
      title,
      description,
      targetAudience,
      uniqueLink,
    });

    await newExam.save();

    res.json({ uniqueLink });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = app;