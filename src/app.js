// ************ Require's ************

const express = require('express');
require('dotenv').config(); // Para poder usar variables de entorno.
const session = require("express-session");
const path = require('path');
const methodOverride = require('method-override'); // Para poder usar los métodos PUT y DELETE.
const cookieParser = require('cookie-parser'); // Para poder usar Cookies.

// ************ express() - (don't touch) ************

const app = express();

// ************ Middlewares - (don't touch) ************

const publicPath = path.resolve(__dirname, '../public');
app.use(session({
    secret: "Secret",
    resave: false,
    saveUninitialized: false,
}));
app.use(express.static(publicPath));  // Indica donde estan los archivos estáticos.
app.use(express.urlencoded({ extended: false }));  // Captura la informacion enviada por POST.
app.use(express.json()); // Solicitudes entrantes con formato JSON.
app.use(methodOverride('_method'));  // Para poder pisar el method="POST" en el formulario por PUT y DELETE.
app.use(cookieParser()); // Middleware Cookie.

// ************ Template Engine - (don't touch) ************

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views')); // Define la ubicación de la carpeta de las vistas.

// ************ Route System require and use() ************

const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const checkoutRouter = require("./routes/checkout");
const queriesRouter = require("./routes/queries");

app.use('/', indexRouter);
app.use('/products/', productsRouter);
app.use('/cart/', cartRouter);
app.use('/checkout/', checkoutRouter);
app.use('/queries/', queriesRouter);

// ************ Run server ************

app.listen(3000, () => {
    console.log('Server running in 3000 port.');
});