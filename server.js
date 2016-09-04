// letip = process.env.
const port = process.env.PORT || 8000;
const express = require('express');
const routes = require('./routes');
const exphbs = require('express-handlebars');

// Initialize Express.js
const app = express();

// Set routing for static files and endpoints
app.use('/', routes);
app.use(express.static('public'));

// Set Handlebars.js as view template engine
app.engine('.hbs', exphbs({ defaultLayout: 'single', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Initialize Server
app.listen(port, () => {
  console.log('Server running and listening on port %s', port); // eslint-disable-line
});
