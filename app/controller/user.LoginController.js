const db = require("../models");
const User = db.user;
const hbc = require("../config/host.config");
const htmp = require("../htmlTemplates")
const sendmail = require('sendmail')();


exports.LogIn = (req, res) => {
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
                    const href = `${hbc.HOST}/api/emailConfirm?token=${user[0].token}&email=${req.body.email}`;
                    sendmail({
                        from: 'no-reply@mydomain.com',
                        to: req.body.email,
                        subject: 'Тестовое сообщение',
                        html: `Перейдите по ссылке: <a href="${href}">${href}<a/>`,
                    }, function (err, reply) {
                        if (err) {
                            console.log(error);
                        } else {
                            console.log('Письмо успешно отправлено: ' + reply);
                        }
                    });

                    res.json({ success: true, statusCode: 201, message: 'Подтвердите учетную запись. Перейдите по ссылке отправленной на почту.' },);
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
            res.end(htmp.accountConfirm());
        } else {
            res.json({ mes: "Проблема с токеном авторизации. Обратитесь в поддержку" })
        }
    }).catch(err => {
        console.log(err)
        res.json({ success: false, errorMessage: 'ERROR' });
    });
};


exports.ChangePassword = (req, res) => {
    User.update(
        { password: req.body.password },
        { where: { email: req.body.email } }
    ).then(result => {
        res.json({ statusCode: 200, message: "Пароль успешно заменен" })
        console.log(result)
    }).catch(err => {
        res.json({ statusCode: 400, message: "Ошибка смены пароля" })
        console.log(err)
    })
};

exports.ChangePasswordSendToEmail = (req, res) => {

    const href = `${hbc.CLIENT_HOST}/changePassword`;
    sendmail({
        from: 'no-reply@mydomain.com',
        to: req.body.email,
        subject: 'Ссылка на смену пароля',
        html: `Перейдите по ссылке чтобы поменять пароль: <a href="${href}">${href}<a/>`,
    }, function (err, reply) {
        if (err) {
            console.log(err);
        } else {
            res.json({message: "Ссылка на смену пароля отпарвлена на почту"});
            console.log('Письмо успешно отправлено: ' + reply);
        }
    });
};