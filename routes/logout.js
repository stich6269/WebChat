exports.post = function (req, res, next) {
    var sid = req.session.id,
        io = req.app.get('io');

    req.session.destroy(function (err) {
        io.$emit('session:reload', sid);
        if (err) return next(err);
        res.redirect('/')
    });
};
