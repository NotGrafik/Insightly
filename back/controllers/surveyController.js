import Sondage from '../schema/survey.js';
import jwt from 'jsonwebtoken';

export const getAllSondages = async (req, res) => {
    try {
        const sondages = await Sondage.find().populate('createur');
        res.json(sondages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const create = async (req, res) => {
    try {
        const newSondage = new Sondage(req.body);
        const savedSondage = await newSondage.save();
        res.json(savedSondage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/*export const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(403).json({ error: 'Invalid token' });
    }
};*/