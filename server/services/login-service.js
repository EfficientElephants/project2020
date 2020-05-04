/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-tabs */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user-model');

function login(req, res) {
  const {
    body
  } = req;
  const {
    password
  } = body;
  let {
    email
  } = body;

  email = email.toLowerCase();

  // Verify user in db.
  User.find({
    email
  }, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error3'
      });
    }
    if (users.length !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Username'
      });
    }
    const user = users[0];
    if (!user.validPassword(password)) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Password'
      });
    }

    // If correct user create send valid response
    return res.send({
      success: true,
      message: 'Valid login',
      token: user._id
    });
  });
}

function verify(req, res) {
  const {
    query
  } = req;
  const {
    token
  } = query;

  // Verify that the token is one of a kind
  // and not deleted

  // for testing
  // api/verify?token=(token number here)

  User.find({
    _id: token
  }, (err, sessions) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (sessions.length !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Session'
      });
    }
    return res.send({
      success: true,
      message: 'Valid Session'
    });
  });
}

function updateDbToken(userObj, token) {
  User.findOne(userObj._id)
    .then((resuser) => {
      const user = resuser;
      user.resetPasswordToken = token;
      user.save();
    })
    .catch((err) => {
      // eslint-disable-next-line no-undef
      res.status(500).send(err);
    });
}

function forgotPassword(req, res) {
  const {
    body
  } = req;
  let {
    email
  } = body;

  email = email.toLowerCase();
  // Verify email exists
  User.find({
    email
  }, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (users.length !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Email'
      });
    }
    const user = users[0];
    const token = crypto.randomBytes(20).toString('hex');
    updateDbToken(user, token);

    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    transporter.verify((error) => {
      if (error) {
        return res.send({
          success: false,
          message: 'Password reset email cannot be sent'
        });
      }
    });

    let tokenLink;
    if (process.env.NODE_ENV === 'test') {
      tokenLink = `http://localhost:3000/#/reset/${token}`;
    } else if (process.env.NODE_ENV === 'dev') {
      tokenLink = `https://project-2020.azurewebsites.net/#/reset/${token}`;
    } else if (process.env.NODE_ENV === 'production') {
      tokenLink = `https://expense-elephant.azurewebsites.net/#/reset/${token}`;
    } else {
      tokenLink = `http://localhost:3000/#/reset/${token}`;
    }

    const mailOptions = {
      from: `${process.env.EMAIL_ADDRESS}`,
      to: `${user.email}`,
      subject: 'Password Reset',
      text: 'You are receiving this because you have requested a password reset.\n\n' +
        'Please click on the following link to reset your password.\n\n' +
        `${tokenLink}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html style="width:100%;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><meta charset=UTF-8>
      <meta content="width=device-width,initiaal-scale=1"name=viewport><meta name=x-apple-disable-message-reformatting><meta content="IE=edge"http-equiv=X-UA-Compatible><meta content="telephone=no"
      name=format-detection><title>New email template 2020-05-04</title><!--[if (mso 16)]><style>a{text-decoration:none}</style><![endif]-->
      <!--[if gte mso 9]><style>sup{font-size:100%!important}</style><![endif]--><style>
      @media only screen and (max-width:600px){a,ol li,p,ul li{font-size:16px!important;line-height:150%!important}h1{font-size:20px!important;text-align:center;line-height:120%!important}h2{font-size:16px!important;text-align:left;line-height:120%!important}h3{font-size:20px!important;text-align:center;line-height:120%!important}h1 a{font-size:20px!important}h2 a{font-size:16px!important;text-align:left}h3 a{font-size:20px!important}.es-menu td a{font-size:14px!important}.es-header-body a,.es-header-body ol li,.es-header-body p,.es-header-body ul li{font-size:10px!important}.es-footer-body a,.es-footer-body ol li,.es-footer-body p,.es-footer-body ul li{font-size:12px!important}.es-infoblock a,.es-infoblock ol li,.es-infoblock p,.es-infoblock ul li{font-size:12px!important}[class=gmail-fix]{display:none!important}.es-m-txt-c,.es-m-txt-c h1,.es-m-txt-c h2,.es-m-txt-c h3{text-align:center!important}.es-m-txt-r,.es-m-txt-r h1,.es-m-txt-r h2,.es-m-txt-r h3{text-align:right!important}.es-m-txt-l,.es-m-txt-l h1,.es-m-txt-l h2,.es-m-txt-l h3{text-align:left!important}.es-m-txt-c img,.es-m-txt-l img,.es-m-txt-r img{display:inline!important}.es-button-border{display:block!important}a.es-button{font-size:14px!important;display:block!important;border-left-width:0!important;border-right-width:0!important}.es-btn-fw{border-width:10px 0!important;text-align:center!important}.es-adaptive table,.es-btn-fw,.es-btn-fw-brdr,.es-left,.es-right{width:100%!important}.es-content,.es-content table,.es-footer,.es-footer table,.es-header,.es-header table{width:100%!important;max-width:600px!important}.es-adapt-td{display:block!important;width:100%!important}.adapt-img{width:100%!important;height:auto!important}.es-m-p0{padding:0!important}.es-m-p0r{padding-right:0!important}.es-m-p0l{padding-left:0!important}.es-m-p0t{padding-top:0!important}.es-m-p0b{padding-bottom:0!important}.es-m-p20b{padding-bottom:20px!important}.es-hidden,.es-mobile-hidden{display:none!important}.es-desk-hidden{display:table-row!important;width:auto!important;overflow:visible!important;float:none!important;max-height:inherit!important;line-height:inherit!important}.es-desk-menu-hidden{display:table-cell!important}.esd-block-html table,table.es-table-not-adapt{width:auto!important}table.es-social{display:inline-block!important}table.es-social td{display:inline-block!important}}#outlook a{padding:0}.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}.es-button{mso-style-priority:100!important;text-decoration:none!important}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}.es-desk-hidden{display:none;float:left;overflow:hidden;width:0;max-height:0;line-height:0;mso-hide:all}.es-button-border:hover a.es-button{background:#fff!important;border-color:#fff!important}.es-button-border:hover{background:#fff!important;border-style:solid solid solid solid!important;border-color:#3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3!important}td .es-button-border-1:hover{border-color:#00ad79 #00ad79 #00ad79 #00ad79!important;background:#d6d6d6!important}td .es-button-border-2:hover{border-color:#00ad79 #00ad79 #00ad79 #00ad79!important;background:#fff!important}td .es-button-border:hover a.es-button-3{background:#d6d6d6!important;border-color:#d6d6d6!important;color:#00ad79!important}
      </style><body style="width:100%;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div class=es-wrapper-color 
      style=background-color:#fafafa><!--[if gte mso 9]><v:background xmlns:v=urn:schemas-microsoft-com:vml fill=t><v:fill type=tile color=#fafafa></v:fill></v:background><![endif]--><table cellpadding=0 
      cellspacing=0 style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top"
      width=100% class=es-wrapper><tr style=border-collapse:collapse><td style=padding:0;Margin:0 valign=top><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100% class=es-content align=center><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0 align=center class=es-adaptive><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:transparent width=600 class=es-content-body align=center bgcolor=#ffffff><tr 
      style=border-collapse:collapse><td style=padding:10px;Margin:0 align=left><table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 
      width=100%><tr style=border-collapse:collapse><td style=padding:0;Margin:0 align=center width=580 valign=top><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100% role=presentation><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0;line-height:14px;font-size:12px;color:#ccc align=center class=es-infoblock><p 
      style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;line-height:14px;color:#ccc">
      <br></table></table></table></table><table cellpadding=0 cellspacing=0 
      style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"
      class=es-header align=center><tr style=border-collapse:collapse><td style=padding:0;Margin:0 align=center class=es-adaptive><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:#3d5ca3 width=600 class=es-header-body align=center bgcolor=#3d5ca3><tr 
      style=border-collapse:collapse><td style=Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px;background-color:#ccc align=left bgcolor=#cccccc>
      <!--[if mso]><table cellpadding=0 cellspacing=0 width=560><tr><td width=270 valign=top><![endif]--><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;float:left class=es-left align=left><tr style=border-collapse:collapse><td style=padding:0;Margin:0 align=left 
      width=270 class=es-m-p20b><table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100% role=presentation><tr 
      style=border-collapse:collapse><td style=padding:0;Margin:0;font-size:0 align=center class=es-m-txt-c><img alt 
      src=https://ibmgol.stripocdn.email/content/guids/a3a64c69-bdd6-4e71-bf5f-6ada516478b4/images/62051588614274219.png 
      style=display:block;border:0;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic width=270></table></table><!--[if mso]><td width=20><td width=270 valign=top><![endif]--><table 
      cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;float:right class=es-right align=right><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0 align=left width=270><table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100% role=presentation><tr 
      style=border-collapse:collapse><td style=padding:0;Margin:0;padding-top:10px;padding-bottom:10px align=right bgcolor=transparent class=es-m-txt-c><span class="es-button-border es-button-border-1"
      style=border-style:solid;border-color:#007a56;background:#efefef;border-width:2px;display:inline-block;border-radius:10px;width:auto><a href=https://expense-elephant.azurewebsites.net 
      style="mso-style-priority:100!important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;font-size:14px;color:#00ad79;border-style:solid;border-color:#efefef;border-width:15px 20px 15px 20px;display:inline-block;background:#efefef;border-radius:10px;font-weight:700;font-style:normal;line-height:17px;width:auto;text-align:center"
      target=_blank class="es-button es-button-3">Visit Our Website!</a></span></table></table><!--[if mso]><![endif]--></table></table><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100% class=es-content align=center><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0;background-color:#fafafa align=center bgcolor=#fafafa><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:#fff width=600 class=es-content-body align=center bgcolor=#ffffff><tr 
      style=border-collapse:collapse><td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:transparent;background-position:left top"align=left 
      bgcolor=transparent><table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100%><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0 align=center width=560 valign=top><table cellpadding=0 cellspacing=0 
      style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-position:left top"width=100% role=presentation><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0;padding-top:15px;padding-bottom:15px align=center><h1 
      style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;font-size:20px;font-style:normal;font-weight:400;color:#333"><strong>FORGOT YOUR
      </strong></h1><h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;font-size:20px;font-style:normal;font-weight:400;color:#333">
      <strong> PASSWORD?</strong></h1><tr style=border-collapse:collapse><td style=padding:0;Margin:0;padding-left:40px;padding-right:40px align=center><p 
      style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;line-height:24px;color:#666">
      Hello!<tr style=border-collapse:collapse><td style=padding:0;Margin:0;padding-right:35px;padding-left:40px align=left><p 
      style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;line-height:24px;color:#666;text-align:center">
      There was a request to change your password!<tr style=border-collapse:collapse><td style=padding:0;Margin:0;padding-top:25px;padding-left:40px;padding-right:40px align=center><p 
      style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;line-height:24px;color:#666">
      If did not make this request, just ignore this email. Otherwise, please click the button below to change your password:<tr style=border-collapse:collapse><td 
      style=Margin:0;padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px align=center><span class="es-button-border es-button-border-2"
      style=border-style:solid;border-color:#007a56;background:#fff;border-width:2px;display:inline-block;border-radius:10px;width:auto><a href=${tokenLink} 
      style="mso-style-priority:100!important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;font-size:14px;color:#00ad79;border-style:solid;border-color:#fff;border-width:15px 20px 15px 20px;display:inline-block;background:#fff;border-radius:10px;font-weight:700;font-style:normal;line-height:17px;width:auto;text-align:center"
      target=_blank class=es-button>RESET PASSWORD</a></span></table></table></table></table><table cellpadding=0 cellspacing=0 
      style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"
      class=es-footer align=center><tr style=border-collapse:collapse><td style=padding:0;Margin:0;background-color:#fafafa align=center bgcolor=#fafafa><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:transparent width=600 class=es-footer-body align=center bgcolor=#ffffff><tr 
      style=border-collapse:collapse><td style=Margin:0;padding-top:10px;padding-left:20px;padding-right:20px;padding-bottom:30px;background-color:#007a56 align=left bgcolor=#007a56><table cellpadding=0 
      cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100%><tr style=border-collapse:collapse><td style=padding:0;Margin:0 align=center width=560 
      valign=top><table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100% role=presentation><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0;padding-top:5px;padding-bottom:5px align=left><h2 
      style="Margin:0;line-height:19px;mso-line-height-rule:exactly;font-family:arial,'helvetica neue',helvetica,sans-serif;font-size:16px;font-style:normal;font-weight:400;color:#fff"><strong>
      Have questions?</strong></h2><tr style=border-collapse:collapse><td style=padding:0;Margin:0;padding-bottom:5px align=left><p 
      style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;line-height:21px;color:#fff">
      We are here to help you manage your money!<br>Contact us: <a href=mailto:expense-elephant@outlook.com 
      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;font-size:14px;text-decoration:none;color:#fff"
      target=_blank>expense-elephant@outlook.com </a><a href=""
      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica,'helvetica neue',arial,verdana,sans-serif;font-size:14px;text-decoration:none;color:#fff"
      target=_blank></a></table></table></table></table><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100% class=es-content align=center><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0;background-color:#fafafa align=center bgcolor=#fafafa><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:transparent width=600 class=es-content-body align=center bgcolor=transparent><tr 
      style=border-collapse:collapse><td style="padding:0;Margin:0;padding-top:15px;background-position:left top"align=left><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100%><tr style=border-collapse:collapse><td style=padding:0;Margin:0 align=center width=600 valign=top>
      <table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100% role=presentation><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px;font-size:0 align=center><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100% role=presentation border=0 height=100%><tr style=border-collapse:collapse><td 
      style="padding:0;Margin:0;border-bottom:1px solid #fafafa;background:0 0;height:1px;width:100%;margin:0"></table></table></table></table></table><table cellpadding=0 cellspacing=0 
      style="mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"
      class=es-footer align=center><tr style=border-collapse:collapse><td style=padding:0;Margin:0;background-color:#fafafa align=center bgcolor=#fafafa><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:transparent width=600 class=es-footer-body align=center bgcolor=transparent><tr 
      style=border-collapse:collapse><td style=Margin:0;padding-bottom:5px;padding-top:15px;padding-left:20px;padding-right:20px align=left><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100%><tr style=border-collapse:collapse><td style=padding:0;Margin:0 align=center width=560 valign=top>
      <table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100%><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0;display:none align=center></table></table></table></table><table cellpadding=0 cellspacing=0 
      style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;table-layout:fixed!important;width:100% class=es-content align=center><tr style=border-collapse:collapse><td 
      style=padding:0;Margin:0 align=center><table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0;background-color:transparent width=600 
      class=es-content-body align=center bgcolor=#ffffff><tr style=border-collapse:collapse><td style=Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px align=left><table 
      cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100%><tr style=border-collapse:collapse><td style=padding:0;Margin:0 
      align=center width=560 valign=top><table cellpadding=0 cellspacing=0 style=mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse;border-spacing:0 width=100%><tr 
      style=border-collapse:collapse><td style=padding:0;Margin:0;display:none align=center></table></table></table></table></table></div></body></html>
      `
    };

    transporter.sendMail(mailOptions, (error2) => {
      if (error2) {
        return res.send({
          success: false,
          message: 'Password reset email cannot be sent'
        });
      }
      return res.send({
        success: true,
        message: 'Password reset email sent'
      });
    });
  });
}

function verifyResetToken(req, res) {
  const {
    query
  } = req;
  const {
    token
  } = query;
  User.find({
    resetPasswordToken: token
  }, (err, user) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    if (user.length !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Error: Invalid Session'
      });
    }
    return res.send({
      success: true,
      message: 'Token Verified',
      token
    });
  });
}

function resetPassword(req, res) {
  const {
    body
  } = req;
  const {
    newPassword,
    token
  } = body;
  User.find({
    resetPasswordToken: token
  })
    .then((users) => {
      if (users.length !== 1) {
        return res.status(401).send({
          success: false,
          message: 'Error: Invalid Session'
        });
      }
      const user = users[0];
      updateDbToken(user, '');
      // update password
      user.password = user.generateHash(newPassword);
      user.save()
        .then(() =>
          res.send({
            success: true,
            message: 'Password is updated'
          }))
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

module.exports = {
  login,
  verify,
  forgotPassword,
  resetPassword,
  verifyResetToken
};
