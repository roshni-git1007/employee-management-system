function authMiddleware(req, res, next) {
    const userEmail = req.cookies.userEmail;

    if (!userEmail) {
        return res.redirect("/login");
    }
    
    // attach data to request object
    req.userEmail = userEmail;

    // user is authenticated -> continue
    next();
}

module.exports = authMiddleware;
