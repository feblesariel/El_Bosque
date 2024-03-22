// ESTE MIDD ES PARA LA RUTA DONDE MP ENVIA EL RESULTADO DE LA TRANSACCION

function noMpRequest (req, res, next){
    if (!req.query.status){
        return res.redirect("/");        
    }
    next();
} 

module.exports = noMpRequest;