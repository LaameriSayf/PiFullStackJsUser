const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

// Vérifier si l'utilisateur est authentifié
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Accès refusé" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token invalide" });
  }
};

// Vérifier les permissions
const authorizePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user.permissions.includes(permission)) {
        return res.status(403).json({ message: "Permission refusée" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
};

module.exports = { verifyToken, authorizePermission };
