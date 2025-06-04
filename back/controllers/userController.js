import User from '../schema/user.js';

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
        const surveys = Survey.find({ creator: req.user.id });
        res.json(surveys);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};