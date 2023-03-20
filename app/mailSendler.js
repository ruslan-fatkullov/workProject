
const nodemailer = require('nodemailer');
const hbc = require("./config/host.config")
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
    html: emailTemplate({ link: `${hbc.HOST}/emailConfirm"` })
};

// Отправляем письмо
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Письмо успешно отправлено: ' + info.response);
    }
});