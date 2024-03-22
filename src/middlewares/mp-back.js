// ESTE MIDD ES PARA ELIMINAR LA COOKIE SUMMARY CUANDO SE VUELVE AL SITIO DESDE MP

function mpBack (req, res, next){
    if (req.query.status !== "approve"){
        res.clearCookie('summary');      
    }
    next();
} 

module.exports = mpBack;