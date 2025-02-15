const express = require("express");
const { verifyToken, authorizePermission } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route accessible uniquement aux utilisateurs avec "create_ticket"
router.post("/tickets", verifyToken, authorizePermission("create_ticket"), (req, res) => {
  res.json({ message: "Ticket créé avec succès" });
});

// Route accessible uniquement aux admins avec "view_reports"
router.get("/reports", verifyToken, authorizePermission("view_reports"), (req, res) => {
  res.json({ message: "Voici le rapport détaillé" });
});

module.exports = router;
