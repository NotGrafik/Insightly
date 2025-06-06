import Sondage from '../schema/survey.js';
import Reponse from '../schema/reponses.js';
import jwt from 'jsonwebtoken';

export const getAllSondages = async (req, res) => {
    try {
        const sondages = await Sondage.find().populate('creator');
        res.json(sondages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSondage = async (req, res) => {
    try {
        const sondage = await Sondage.findById(req.params.id).populate('creator');
        if (!sondage) return res.status(404).json({ error: 'Sondage not found' });
        res.json(sondage);
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

export const deleteSondage = async (req, res) => {
    try {
        const sondage = await Sondage.findById(req.params.id);
        if (!sondage) return res.status(404).json({ error: 'Sondage not found' });

        await sondage.remove();
        res.json({ message: 'Sondage deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const responseToSondage = async (req, res) => {
    try {
        const sondage = await Sondage.findById(req.params.id);
        if (!sondage) return res.status(404).json({ error: 'Sondage not found' });
        
        const reponseInstance = new Reponse(req.body);
        const savedReponse = await reponseInstance.save();
        res.json(savedReponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const getResponses = async (req, res) => {
    try {
        const sondage = await Sondage.findById(req.params.id);
        if (!sondage) return res.status(404).json({ error: 'Sondage not found' });

        const reponses = await Reponse.find({ survey_id: req.params.id });
        res.json(reponses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const isResponse = async (req, res) => {
    try {
        const existingResponse = await Reponse.findOne({
            survey_id: req.params.surveyId,
            'responses.question_id': req.params.questionId
        });

        if (existingResponse) {
            res.json(true);
        } else {
            res.json(false);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}