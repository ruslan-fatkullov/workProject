const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const hbc = require("../config/host.config");
const { where } = require("sequelize");
const { use } = require("../routes/userRoutes");



/*require('crypto').randomBytes(16, function(err, buffer){
    var token = buffer.toString('hex');
    
});*/

exports.LogIn = (req, res) => {

    const em = req.body.email;

    User.findAll({
        limit: 1,
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.json({ success: false, statusCode: 403, message: 'Пользователь с таким логином не найден' });
        } else {
            if (!(user[0].password == req.body.password)) {
                res.json({ success: false, statusCode: 403, message: 'Неверный пароль' });
            } else {

                if (user[0].active == "0") {
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
                    const token = user[0].token;
                    // Настройки письма
                    const mailOptions = {
                        from: hbc.mail.auth,
                        to: req.body.email,
                        subject: 'Подтвержение аккаунта',
                        html: emailTemplate({ link: `${hbc.HOST}/api/emailConfirm?token=${token}&email=${em}` })
                    };

                    // Отправляем письмо
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Письмо успешно отправлено: ' + info.response);
                        }
                    });
                    res.json({ success: true, statusCode: 200, message: 'Подтвердите учетную запись. Перейдите по ссылке отправленной на почту ' + em },);
                } else {
                    res.json({ success: true, statusCode: 200, message: 'Авторизация прошла успешно' },);
                }


            }
        }
    }).catch(err => {
        console.log(err)
        res.json({ success: false, message: 'ERROR' });
    });

};

exports.EmailConfirm = (req, res) => {
    User.findAll({
        limit: 1,
        where: {
            email: req.query.email
        }
    }).then(function (user) {
        if (user[0].token == req.query.token) {
            User.update(
                { active: 1 },
                { where: { email: req.query.email } }
            ).then(res => {
                console.log(res)
            });
            res.json({ mes: "Учетная запись подтверждена" })
        } else {
            res.json({ mes: "Проблема с токеном авторизации. Обратитесь в поддержку" })
        }
    }).catch(err => {
        console.log(err)
        res.json({ success: false, errorMessage: 'ERROR' });
    });
};


exports.ChangePassword = (req, res) => {
    User.findAll({
        limit: 1,
        where: {
            email: req.query.email
        }
    }).then(function (user) {
        
        

        
    }).catch(err => {
        console.log(err)
        res.json({ success: false, errorMessage: 'ERROR' });
    });
};