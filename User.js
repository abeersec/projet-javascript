const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: [true, "L'email est requis !"] },
  password: {
    type: String,
    required: true,
    select: false
  },
  nom: { type: String, required: [true, "Le nom est requis !"] },
  prenom: { type: String, required: [true, "Le prénom est requis !"] },
  dateNaissance: { type: Date, required: [true, "La date de naissance est requise !"] },
  sexe: { type: String, enum: ['homme', 'femme'], required: [true, "Le sexe est requis !"] },
  etablissement: { type: String, required: [true, "L'établissement est requis !"] },
  filiere: { type: String, required: [true, "La filière est requise !"] },
  role: { type: String, enum: ['teacher', 'student'], required: [true, "Le rôle est requis !"] },
  matiere: { type: String },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);