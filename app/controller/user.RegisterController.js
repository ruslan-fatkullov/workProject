const db = require("../models/");
const User = db.user;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');



exports.signUp = (req, res) => {
    User.findAll({
        limit: 1,
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (user.length > 0) {
            res.json({ success: false, statusCode: 302, errorMessage: 'Email ID is already exist in system' });
        } else {
            User.create({
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                email : req.body.email,
                password : req.body.password,
                active : 0,
            }).then(function () {
                res.json({ success: true, statusCode: 200, message: "User has been registered successfully" });
            });
             
        }
    }).catch(err => {
        console.log(err)
        res.json("error")
    });

};




// Retrieve all User from the database.
exports.findAll = (req, res) => {

    User.findAll({ raw: true }).then(data => {
        res.json({
            users: data
        });
    }).catch(err => console.log(err));

};