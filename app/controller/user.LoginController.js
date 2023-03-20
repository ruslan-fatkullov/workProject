const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const hbс = require("../config/host.config")



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
            res.json({ success: false, statusCode: 403, Message: 'Пользователь с таким логином не найден' });
        } else {
            if (!(user[0].password == req.body.password)) {
                res.json({ success: false, statusCode: 403, Message: 'Неверный пароль' });
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
                            user: hbс.mail.auth,
                            pass: hbс.mail.pass
                        }
                    });

                    const emailTemplate = ({ link }) => `<p>Перейдите по ссылке:  <a href="${link}">${link}</a></p>`;

                    // Настройки письма
                    const mailOptions = {
                        from: hbс.mail.auth,
                        to: req.body.email,
                        subject: 'Подтвержение аккаунта',
                        html: emailTemplate({ link: `${hbс.HOST}/emailConfirm"` })
                    };

                    // Отправляем письмо
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Письмо успешно отправлено: ' + info.response);
                        }
                    });
                    res.json({ success: true, statusCode: 200, Message: 'Подтвердите учетную запись. Перейдите по ссылке отправленной на почту ' + em },);
                } else {
                    res.json({ success: true, statusCode: 200, Message: 'Авторизация прошла успешно' },);
                }


            }
        }
    }).catch(err => {
        console.log(err)
        res.json({ success: false, errorMessage: 'ERROR' });
    });

};

exports.EmailConfirm = (req, res) => {
    res.json({ mes: "Учетная запись подтверждена" })
};

/*const em = req.body.email;

const nodemailer = require('nodemailer');

// Создаем объект transporter с настройками почтового сервера
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    secure: false,
    auth: {
        user: dbc.mail.auth,
        pass: dbc.mail.pass
    }
});

// Настройки письма
const mailOptions = {
    from: dbc.mail.auth,
    to: req.body.email,
    subject: 'Тестовое сообщение',
    text: 'Привет! Это тестовое сообщение.'
};

// Отправляем письмо
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('____________________________________________');
        console.log('Письмо успешно отправлено: ' + info.response);
        console.log('____________________________________________');
        res.json({ message: "Письмо успешно отправлено на почту:" + em });
    }
});*/




