import Sondage from '../schema/survey.js';
import User from '../schema/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSurveys = async (req, res) => {
    try {
        const surveys = await Sondage.find({ creator: req.user.id });
        res.json(surveys);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        let hashedPassword = req.user.passwordHash;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(req.body.password, salt);
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, email, passwordHash: hashedPassword },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });

        const token = jwt.sign({ id: user._id, name: user.firstName + " " + user.lastName, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.cookie('token', token, {
            httpOnly: false,
            maxAge: 86400000,
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js";

export const requestPasswordReset = async (req, res) => {
    const mailgun = new Mailgun(FormData);
    console.log(process.env.MAILGUN_API_KEY); // doit afficher true

    const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY,
    });
    try {
        const data = await mg.messages.create("sandboxa2e73fdc20be46a1a2f410f49f70fb8a.mailgun.org", {
            from: "Mailgun Sandbox <postmaster@sandboxa2e73fdc20be46a1a2f410f49f70fb8a.mailgun.org>",
            to: ["Pablo Jean Louis <pablopjl64@gmail.com>"],
            subject: "Reset Password Request",
            html: `<p>Bonjour,</p>
                    <p>Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                    <p><a href="http://localhost:5173/reset-password/${req.body.token}">Réinitialiser le mot de passe</a></p>
                `
        });

        console.log(data); // logs response data
    } catch (error) {
        console.log(error); //logs any error
    }
};


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Token invalide ou expiré' });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
};
