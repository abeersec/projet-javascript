const jwt = require('jsonwebtoken');
const { signupSchema, signinSchema } = require('../middlewares/validator');
const {  doHashValidation } = require('../utils/hashing');
const User = require('../models/User');
const json  = require('express');


exports.signup = async (req, res) => {
    const { email, password, nom, prenom, dateNaissance, sexe, etablissement, filiere, role } = req.body;
    const matiere = req.body.matiere || "";
    try {
        const { error } = signupSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Cet utilisateur existe déjà !" });
        }
        let userData = { email, password, nom, prenom, dateNaissance, sexe, etablissement, filiere, role };
        if (role === "teacher") {
            userData.matiere = matiere;
        }
        const newUser = await User.create(userData);
        newUser.password = undefined;
        res.status(201).json({ success: true, message: "Compte créé avec succès !", result: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error } = signinSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé !" });
        }
        const isValid = await doHashValidation(password, existingUser.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Identifiants invalides !' });
        }
        const token = jwt.sign(
            { password: existingUser.password, email: existingUser.email, verified: existingUser.verified },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.cookie('Authorization', `Bearer ${token}`, {
            secure: process.env.TOKEN_SECRET === 'production',
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000),
        });
        res.json({ success: true, token, message: "Connecté avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
};


