// controllers/authController.js
import User from '../schema/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            passwordHash: hashedPassword
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: "Erreur lors de l'enregistrement de l'utilisateur." });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé." });
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

        const token = jwt.sign({ id: user._id, name: user.firstName + " " + user.lastName, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.cookie('token', token, {
            httpOnly: true,             
            secure: true,            
            sameSite: 'None',          
            maxAge: 86400000,   
        });
        res.status(200).json({ message: "Connexion réussie." });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la connexion de l'utilisateur." });
    }
};


export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Déconnexion réussie." });
}