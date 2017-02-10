const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const db = require("./models");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(expressValidator());


app.use(express.static(process.cwd() + "/public"));
app.use(methodOverride("_method"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("./public"));
app.use(cookieParser());

app.use(session({
  secret: "secret",
  // store: new SequelizeStore({
  //   db: db.sequelize
  // }),
  cookie: {maxAge: 180*60*1000},
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize()); 
app.use(passport.session());

app.use(flash());

app.use( (request, response, next)=> {
  response.locals.success_msg = request.flash('success_msg');
  response.locals.error_msg = request.flash('error_msg');
  response.locals.error =request.flash('error');
  response.locals.user = request.user || null;
  next();
});

require("./controllers/controllers.js")(app);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    });
});
