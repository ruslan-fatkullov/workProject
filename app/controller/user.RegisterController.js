const db = require("../models/");
const User = db.user;
const sendmail = require('sendmail')();

const crypto = require("crypto")
const hbc = require("../config/host.config")

exports.signUp = (req, res) => {
    User.findAll({
        limit: 1,
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (user.length > 0) {
            res.json({ success: false, statusCode: 302, message: 'Пользователь с таким email уже существует' });
        } else {
            const token = crypto.randomBytes(16).toString("hex");
            User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                active: 0,
                token: token
            }).then(function () {
                const href = `${hbc.HOST}/api/emailConfirm?token=${token}&email=${req.body.email}`;
                sendmail({
                    from: 'no-reply@mydomain.com',
                    to: req.body.email,
                    subject: 'Тестовое сообщение',
                    html: `Перейдите по ссылке: <a href="${href}">${href}<a/>`,
                }, function (err, reply) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Письмо успешно отправлено: ' + reply);
                    }
                });
                res.json({ success: true, statusCode: 200, message: "Регистрация прошла успешно. Для подтверждения ученой записи пройдите по ссылке отправленной на почту." });
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