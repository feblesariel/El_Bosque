// ESTE MIDD ES PARA LAS RUTAS QUE NO SE PUEDE VER SI NO EXISTE LA COOKIE CART

function summary (req, res, next){
    if (!req.cookies.summary){
        return res.redirect("/");        
    }
    next();
} 

module.exports = summary;