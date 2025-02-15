const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config(); // Charger les variables d'environnement

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Configuration du moteur de vue
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // Utilisation de Pug comme moteur de vue

// Middleware de journalisation et gestion des requêtes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Définition des routes principales
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Connexion à MongoDB avec gestion des erreurs
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err);
    process.exit(1); // Arrêter l'application si la connexion échoue
  });

// Routes API
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/protected"));

// Gestion des erreurs 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Gestion globale des erreurs
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Si l'application est en mode développement, afficher les erreurs détaillées
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
