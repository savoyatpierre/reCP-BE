require("dotenv").config();
const CryptoJS = require("crypto-js");
const User = require("../../models/User.js");
const random_string = require("../../utils/random_string.js");

module.exports = userCreate = (req, res, next) => {
/*

create a user

possible response types
- user.create.success
- user.create.error

*/

if (process.env.DEBUG) {
console.log("user.create");
}

const userToSave = { ...req.body };
if (userToSave.userid === undefined) {
    userToSave.userid = random_string(24)
}
if (userToSave.type === undefined) {
    userToSave.type = "user"
}
userToSave.state = "inactive"
userToSave.password = "TO RESET"
if (req.body.encryption === false) {
    if (userToSave.name !== undefined) {
    userToSave.name = CryptoJS.AES.decrypt(
        userToSave.name,
        process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    }
    if (userToSave.login !== undefined) {
    userToSave.login = CryptoJS.AES.decrypt(
        userToSave.login,
        process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    }
}
console.log("userToSave", userToSave)
userToSave = new User(userToSave)

// Save
userToSave
.save()
.then(() => {
console.log("user.create.success");
return res.status(201).json({
type: "user.create.success",
data: {
user: userToSave,
},
});
})
.catch((error) => {
console.log("user.create.error");
console.error(error);
return res.status(400).json({
type: "user.create.error",
error: error,
data: {
user: undefined,
},
});
});
};