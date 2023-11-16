// Middleware to check if the user is authenticated
function logSessionId(req, res, next) {
    console.log('logSessionId:', req.session.userId)
    next();
}

/**
 * Use this middleware to restrict access to routes:
 * router.get('/somethingPrivate', mustBeAuthenticated, (req, res) => { rest of code... })
 */
function mustBeAuthenticated(req, res, next) {
    if (req.session.userId) next();
    else res.status(401).json({ message: 'You must be logged in to access this resource' })
}

module.exports = {
    logSessionId,
    mustBeAuthenticated
}