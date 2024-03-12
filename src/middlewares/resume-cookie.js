// ESTE MIDD ES PARA LAS RUTAS QUE NO SE PUEDE VER SI NO EXISTE LA COOKIE CART

function resume (req, res, next){
    if (!req.cookies.resume){
        return res.redirect("/");        
    }
    next();
} 

module.exports = resume;