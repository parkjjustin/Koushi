const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./models");


app.use(express.static(process.cwd() + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./controllers/controllers.js")(app);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    });
});
