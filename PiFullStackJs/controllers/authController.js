const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const rolePermissions = require("../config/rolePermissions");

dotenv.config();

// Inscription d'un utilisateur
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!rolePermissions[role]) {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    const user = new User({
      username,
      email,
      password,
      role,
      permissions: rolePermissions[role]
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Connexion et génération de JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { register, login };
