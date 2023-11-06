
const renderPerfil=(req, res) => {
    const user = req.user
    res.render("perfil",{user:user});
}

module.exports ={
    renderPerfil,
}