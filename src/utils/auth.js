const helpers = {}
helpers.isAuthenticated=(req, res, next)=> {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/api/users/login');
    }
}
helpers.isAuthenticatedUser=(req, res, next)=> {
    if (req.user.role!="admin") {
        return next()
    } else {
        res.redirect('/api/perfil');
    }
}

helpers.isAuthenticatedAdmin=(req, res, next)=> {
    if (req.user.role=="admin") {
        return next()
    } else {
        res.redirect('/api/perfil');
    }
}
helpers.isAuthenticatedAorP=(req, res, next)=> {
    if (req.user.role=="premium" || req.user.role=="admin") {
        return next()
    } else {

        res.redirect('/api/perfil');
    }
}
module.exports = helpers