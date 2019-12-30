const CError = require('../errors/cError')
const sql = require('../db/sql')
const error = require('http-errors')
const _resp = require('../lib/resp')
const sendSms = require('../lib/sms')
const reviewModel = require('../db/mongo/review')
const bookModel = require('../db/mongo/bookings')
const bookParams = require('../utils/bookschema')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function getProfile (req, res, next) {
  return sql.User.findOne({
    attributes: ['name', 'dob', 'gender', 'email', 'phNumber'],
    where: { userId: req.user.userId }
  }).then(user => {
    res.json(_resp(user))
  }).catch(err => {
    next(error(err))
  })
}

function getMyBookings (req, res, next) {
  return bookModel.find({
    userId: req.user.userId
  }).select(bookParams).then(bookings => {
    if (bookings.length < 1) {
      return next(error(new CError({
        status: 404,
        message: 'No bookings available.',
        name: 'NotFound'
      })))
    }
    res.json(_resp(bookings))
  }).catch(err => {
    next(error(err))
  })
}

function getBookingById (req, res, next) {
  return bookModel.find({
    ticket_number: req.params.bookId,
    userId: req.user.userId
  }).select(bookParams)
    .then(booking => {
      if (!booking) {
        return next(error(new CError({
          status: 404,
          message: 'No booking available.',
          name: 'NotFound'
        })))
      }
      res.json(_resp(booking))
    }).catch(err => {
      next(error(err))
    })
}

function sendTicket (req, res, next) {
  return bookModel.findOne({
    ticket_number: req.body.bookId,
    userId: req.user.userId
  }).select(bookParams)
    .then(booking => {
      if (!booking) {
        throw new CError({
          status: 404,
          message: 'No active bookings available.',
          name: 'NotFound'
        })
      }

      let seats = ''
      booking.seat_fare_details.forEach(seatData => {
        if (seatData.seat_detail.status === 'DONE') {
          seats += seatData.seat_detail.seat_number + ','
        }
      })

      if (seats === '') {
        throw new CError({
          status: 404,
          message: 'No active seats for booking.',
          name: 'NotFound'
        })
      }

      const day = new Date(booking.travel_date)
      const journeyDetails = booking.origin + ' To ' + booking.destination
      const dateString = day.getDate() + '-' + (day.getMonth() + 1) + '-' + day.getFullYear()
      const msg = `YoloBus:${booking.ticket_number},${journeyDetails} PNR:YO-${booking.operator_pnr},DOJ:${dateString},Time:${booking.dep_time},seats:${seats}`

      if (booking.passenger_details.email) {
        sendEmail(booking.passenger_details, booking, journeyDetails, seats)
      }

      // TODO ticket url
      // TODO ticket message format
      // `PNR: ${pnr},Bus:15609,DOJ:22-06-2014,TIME:22:00,3A,GHY TO ROK,RAJAN,B1 35,FARE:1670,SC:22.47+PG CHGS.`
      sendSms(booking.passenger_details.mobile, msg)
        .catch(err => {
          throw err
        })
      res.json(_resp('OK'))
    }).catch(err => {
      next(error(err))
    })
}

function rating (req, res, next) {
  return reviewModel.create({
    sId: req.body.sId,
    user: req.user.userId,
    cmnt: req.body.comment,
    rt: req.body.rating
  }).then(data => {
    bookModel.updateOne({
      ticket_number: req.body.sId,
      isRate: false
    }, { isRate: true }).catch(err => {
      console.log(err)
    })

    res.json(_resp('OK'))
  }).catch(err => {
    next(error(err))
  })
}

function refunds (req, res, next) {
  return sql.Refund.findAll({
    attributes: {
      exclude: ['deletedAt', 'updatedAt']
    },
    where: {
      userId: req.user.userId
    }
  }).then(refunds => {
    if (refunds.length < 1) {
      return next(error(new CError({
        status: 404,
        message: 'No refunds available.',
        name: 'NotFound'
      })))
    }

    res.json(_resp(refunds))
  }).catch(err => {
    next(error(err))
  })
}

function updateProfile (req, res, next) {
  return sql.User.update(req.body, {
    where: { userId: req.user.userId }
  }).then(row => {
    res.json(_resp('OK'))
  }).catch(err => {
    next(error(err))
  })
}

function sendEmail (user, booking, journeyDetails, seats) {
  const msg = {
    to: user.email, // receiver's email
    from: 'support@yolobus.in', // sender's email
    subject: `YoloBus Ticket Confirmation for ${booking.ticket_number}`, // Subject
    html: `<!doctype html><html>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Simple Transactional Email</title>
        <style>
          /* -------------------------------------
              GLOBAL RESETS
          ------------------------------------- */
          
          /*All the styling goes here*/
          
          img {
            border: none;
            -ms-interpolation-mode: bicubic;
            max-width: 100%; 
          }
          body {
            background-color: #f6f6f6;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%; 
          }
          table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%; }
            table td {
              font-family: sans-serif;
              font-size: 14px;
              vertical-align: top; 
          }
          /* -------------------------------------
              BODY & CONTAINER
          ------------------------------------- */
          .body {
            background-color: #f6f6f6;
            width: 100%; 
          }
          /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
          .container {
            display: block;
            margin: 0 auto !important;
            /* makes it centered */
            max-width: 580px;
            padding: 10px;
            width: 580px; 
          }
          /* This should also be a block element, so that it will fill 100% of the .container */
          .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px; 
          }
          /* -------------------------------------
              HEADER, FOOTER, MAIN
          ------------------------------------- */
          .main {
            background: #ffffff;
            border-radius: 3px;
            width: 100%; 
          }
          .wrapper {
            box-sizing: border-box;
            padding: 20px; 
          }
          .content-block {
            padding-bottom: 10px;
            padding-top: 10px;
          }
          .footer {
            clear: both;
            margin-top: 10px;
            text-align: center;
            width: 100%; 
          }
            .footer td,
            .footer p,
            .footer span,
            .footer a {
              color: #999999;
              font-size: 12px;
              text-align: center; 
          }
          /* -------------------------------------
              TYPOGRAPHY
          ------------------------------------- */
          h1,
          h2,
          h3,
          h4 {
            color: #000000;
            font-family: sans-serif;
            font-weight: 400;
            line-height: 1.4;
            margin: 0;
            margin-bottom: 30px; 
          }
          h1 {
            font-size: 35px;
            font-weight: 300;
            text-align: center;
            text-transform: capitalize; 
          }
          p,
          ul,
          ol {
            font-family: sans-serif;
            font-size: 14px;
            font-weight: normal;
            margin: 0;
            margin-bottom: 15px; 
          }
            p li,
            ul li,
            ol li {
              list-style-position: inside;
              margin-left: 5px; 
          }
          a {
            color: #3498db;
            text-decoration: underline; 
          }
          /* -------------------------------------
              BUTTONS
          ------------------------------------- */
          .btn {
            box-sizing: border-box;
            width: 100%; }
            .btn > tbody > tr > td {
              padding-bottom: 15px; }
            .btn table {
              width: auto; 
          }
            .btn table td {
              background-color: #ffffff;
              border-radius: 5px;
              text-align: center; 
          }
            .btn a {
              background-color: #ffffff;
              border: solid 1px #3498db;
              border-radius: 5px;
              box-sizing: border-box;
              color: #3498db;
              cursor: pointer;
              display: inline-block;
              font-size: 14px;
              font-weight: bold;
              margin: 0;
              padding: 12px 25px;
              text-decoration: none;
              text-transform: capitalize; 
          }
          .btn-primary table td {
            background-color: #3498db; 
          }
          .btn-primary a {
            background-color: #3498db;
            border-color: #3498db;
            color: #ffffff; 
          }
          /* -------------------------------------
              OTHER STYLES THAT MIGHT BE USEFUL
          ------------------------------------- */
          .last {
            margin-bottom: 0; 
          }
          .first {
            margin-top: 0; 
          }
          .align-center {
            text-align: center; 
          }
          .align-right {
            text-align: right; 
          }
          .align-left {
            text-align: left; 
          }
          .clear {
            clear: both; 
          }
          .mt0 {
            margin-top: 0; 
          }
          .mb0 {
            margin-bottom: 0; 
          }
          .preheader {
            color: transparent;
            display: none;
            height: 0;
            max-height: 0;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
            mso-hide: all;
            visibility: hidden;
            width: 0; 
          }
          .powered-by a {
            text-decoration: none; 
          }
          hr {
            border: 0;
            border-bottom: 1px solid #f6f6f6;
            margin: 20px 0; 
          }
          /* -------------------------------------
              RESPONSIVE AND MOBILE FRIENDLY STYLES
          ------------------------------------- */
          @media only screen and (max-width: 620px) {
            table[class=body] h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important; 
            }
            table[class=body] p,
            table[class=body] ul,
            table[class=body] ol,
            table[class=body] td,
            table[class=body] span,
            table[class=body] a {
              font-size: 16px !important; 
            }
            table[class=body] .wrapper,
            table[class=body] .article {
              padding: 10px !important; 
            }
            table[class=body] .content {
              padding: 0 !important; 
            }
            table[class=body] .container {
              padding: 0 !important;
              width: 100% !important; 
            }
            table[class=body] .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important; 
            }
            table[class=body] .btn table {
              width: 100% !important; 
            }
            table[class=body] .btn a {
              width: 100% !important; 
            }
            table[class=body] .img-responsive {
              height: auto !important;
              max-width: 100% !important;
              width: auto !important; 
            }
          }
          /* -------------------------------------
              PRESERVE THESE STYLES IN THE HEAD
          ------------------------------------- */
          @media all {
            .ExternalClass {
              width: 100%; 
            }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%; 
            }
            .apple-link a {
              color: inherit !important;
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              text-decoration: none !important; 
            }
            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
            }
            .btn-primary table td:hover {
              background-color: #34495e !important; 
            }
            .btn-primary a:hover {
              background-color: #34495e !important;
              border-color: #34495e !important; 
            } 
          }
        </style>
      </head>
      <body class="">
        <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
                <img src="https://yolo-web.s3.ap-south-1.amazonaws.com/logo.png"/>
                <!-- START CENTERED WHITE CONTAINER -->
                <table role="presentation" class="main">
    
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p>Hi ${user.name},</p>
                            <p>Ticket Number: ${booking.ticket_number}</p>
                            <p>Details: ${journeyDetails}</p>
                            <p>PNR: YO-${booking.operator_pnr}</p>
                            <p>Time: ${booking.dep_time}</p>
                            <p>seats: ${seats}</p>
                            <p>Thank you for bokking with us.</p>
                            <p>Good luck! for the upcoming journey.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                <!-- END MAIN CONTENT AREA -->
                </table>
                <!-- END CENTERED WHITE CONTAINER -->
                <!-- START FOOTER -->
                <div class="footer">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="content-block">
                        <span class="apple-link"YoloBus Pvt, Ltd. Gurgaon</span>
                      </td>
                    </tr>
                  </table>
                </div>
                <!-- END FOOTER -->
              </div>
            </td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </body>
    </html>`
  }

  sgMail.send(msg)
}

module.exports = {
  getProfile,
  getMyBookings,
  getBookingById,
  sendTicket,
  updateProfile,
  rating,
  refunds
}
