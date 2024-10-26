const islogedIn = function (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/sign");
};

module.exports = islogedIn;
