const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

const dbc = require("../config/db.config");


/*require('crypto').randomBytes(16, function(err, buffer){
    var token = buffer.toString('hex');
    
});*/

exports.LogIn = (req, res) => {

    User.findAll({
        limit: 1,
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (user.length == 0) {
            res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. User not found.' });
        } else {
            if (!(user[0].password == req.body.password)) {
                res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. Wrong password.' });
            } else {


                const em = req.body.email;

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
                for (let i = 0; i < 100; i++) { // выведет 0, затем 1, затем 2
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('____________________________________________');
                            console.log('Письмо успешно отправлено: ' + info.response);
                            console.log('____________________________________________');
                            res.json({ message: "Письмо успешно отправлено на почту:" + em });
                        }
                    });
                }
                





                //res.json({ success: true, statusCode: 200, Message: 'Success', token: token },);
            }
        }
    }).catch(err => {
        console.log(err)
        res.json({ success: false, errorMessage: 'ERROR' });
    });

};
