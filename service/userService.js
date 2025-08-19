exports.userAll = `SELECT * FROM user;`
exports.getUserById = `SELECT * FROM user WHERE id = ?;`
exports.deleteUser = `DELETE FROM user WHERE id = ?;`