const Joi = require('joi');

exports.signupSchema = Joi.object({
    email: Joi.string().email({ tlds: {allow: ['com','net'] } }).min(6).max(60).required().messages({
        'string.email': "L'email doit être valide.",
        'string.empty': "L'email est requis.",
        'any.required': "L'email est requis."
    }),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')).required().messages({
        'string.pattern.base': "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.",
        'string.empty': "Le mot de passe est requis.",
        'any.required': "Le mot de passe est requis."
    }),
}); 

exports.signinSchema = Joi.object({
    email: Joi.string().email({ tlds: {allow: ['com','net'] } }).min(6).max(60).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')).required(),
});