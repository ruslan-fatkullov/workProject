const db = require("../models/");
const User = db.user;
const Op = db.Sequelize.Op;

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

            var token = crypto.randomBytes(16).toString("hex");
            User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                active: 0,
                token: token
            }).then(function () {
                const em = req.body.email;
                const nodemailer = require('nodemailer');
                
                // Создаем объект transporter с настройками почтового сервера
                const transporter = nodemailer.createTransport({
                    host: 'smtp.mail.ru',
                    port: 587,
                    secure: false,
                    auth: {
                        user: hbc.mail.auth,
                        pass: hbc.mail.pass
                    }
                });

                const emailTemplate = ({ link }) => `<p>Перейдите по ссылке:  <a href="${link}">${link}</a></p>`;

                // Настройки письма
                const mailOptions = {
                    from: hbc.mail.auth,
                    to: req.body.email,
                    subject: 'Подтвержение аккаунта',
                    html: emailTemplate({ link: `${hbc.HOST}/api/emailConfirm?token=${token}&email=${em}`})
                };

                // Отправляем письмо
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Письмо успешно отправлено: ' + info.response);
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