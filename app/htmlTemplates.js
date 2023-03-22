exports.accountConfirm = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Подтверждение аккаунта</title>
        <style>
            .confirmation {
                font-size: 24px;
                font-weight: bold;
                color: green;
                text-align: center;
                margin-top: 50px;
            }
        </style>
    </head>
    <body>
        <div class="confirmation">Ваш аккаунт подтвержден</div>
    </body>
    </html>
    `;
}
