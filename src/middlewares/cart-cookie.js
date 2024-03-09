// ESTE MIDD ES PARA LAS RUTAS QUE NO SE PUEDE VER SI NO EXISTE LA COOKIE CART

function cart (req, res, next){
    if (!req.cookies.cart){
        return res.redirect("/");        
    }
    next();
} 

module.exports = cart;