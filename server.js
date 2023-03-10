const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const path = require('path');
const Goal = require('./models/Goal');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware for parsing JSON and urlencoded form data
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Wildcard route to redirect all other URLs to index page
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/templates/index.html'));
});

sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
});