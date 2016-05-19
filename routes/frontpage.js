exports.get = function (req, res) {
    console.log('index page');
    res.render('frontpage', {title: 'Express'});
};
