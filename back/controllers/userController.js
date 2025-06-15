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

export const getOtherUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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