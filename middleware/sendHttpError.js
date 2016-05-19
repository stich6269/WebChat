module.exports = function (req, res, next) {
    res.sendHttpError = function (error) {
        res.status(error.status);
        if(req.headers['x/requested-width'] == 'XMLHttpRequest'){
            res.json(error)
        }else {
            res.render('error', {error: error})
        }
    };

    next();
};