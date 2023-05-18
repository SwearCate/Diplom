exports.allAccess = (req, res) => {
    res.status(200).send("HelloWorld.");
};
exports.userBoard = (req, res) => {
    res.status(200).send("Пользовательский контент.");
};
exports.adminBoard = (req, res) => {
    res.status(200).send("Админ панель.");
};
exports.moderatorBoard = (req, res) => {
    res.status(200).send("Панель модератора.");

};