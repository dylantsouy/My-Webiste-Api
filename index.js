const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const db = require('./db');
const Routing = require('./router/routing');
const PORT = process.env.PORT || 5000;
db.connect();

const app = express();

app
  .use(cors())
  .use(express.static(path.join(__dirname, 'public')))
  // configure Handlebars view engine
  .engine('handlebars', expressHandlebars({ defaultLayout: 'index' }))
  .use(helmet.hidePoweredBy())
  .use('/', Routing)
  .set('view engine', 'handlebars')
  .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
