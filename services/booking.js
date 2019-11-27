const rzp = require('../config/razorpay')
const error = require('http-errors')
const CError = require('../errors/cError')
const bookModel = require('../db/mongo/bookings')
const _resp = require('../lib/resp')
const api = require('../lib/bitla')

async function initBooking (req, res, next) {
  let booking
  try {
    booking = serializeBooking(req)
  } catch (err) {
    return next(error(err))
  }

  let bookData
  return bookModel.create({
    ticket_status: 'INIT',
    total_fare: req.data.totalAmount,
    seatMeta: req.body.seats,
    seats: req.data.rawSeats,
    userId: req.user.userId
  }).then(bookRecord => {
    return api('book', [req.body.sId, booking])
      .then(bookingData => {
        console.log(JSON.stringify(bookingData))
        if (bookingData.hasOwnProperty('response')) {
          throw new CError({
            status: bookingData.response.code,
            message: 'Error while booking',
            name: 'BookinError'
          })
        }
        bookData = bookingData
        return rzp.orders.create({
          amount: req.data.totalAmount * 100,
          currency: 'INR',
          receipt: bookingData.result.ticket_details.pnr_number,
          payment_capture: 1,
          notes: {
            user: req.user.userId
          }
        })
      }).then(rzpRecord => {
        bookRecord.orderId = rzpRecord.id
        bookRecord.ticket_number = bookData.result.ticket_details.pnr_number
        bookRecord.operator_pnr = bookData.result.ticket_details.operator_pnr
        bookRecord.save()
        return res.json(_resp(rzpRecord))
      })
  }).catch(err => {
    next(error(err))
  })
}

function commitBooking (req, res, next) {
  // const validate = rzp.ValidateOrder(req.body.data)

  // if (!validate) {
  //   throw Error('Payment data can not be validated, contact support')
  // }

  const ticketNumber = req.body.data.bookId
  return api('validate', ticketNumber)
    .then(data => {
      console.log(JSON.stringify(data))
      if (data.hasOwnProperty('response')) {
        throw new CError({
          status: data.response.code,
          message: 'Error while confirming booking',
          name: 'BookinError'
        })
      }
      const details = data.result.ticket_details
      details.paymentId = req.body.data.paymentId
      return bookModel.findOneAndUpdate({
        userId: req.user.userId,
        ticket_number: ticketNumber,
        ticket_status: 'INIT'
      }, details).then(bookRecord => {
        if (!bookRecord) {
          throw new CError({
            status: 404,
            message: 'No valid booking data ' +
            'contact support for further assistance',
            name: 'NotFound'
          })
        }
        return res.json(_resp(ticketNumber))
      })
    }).catch(err => {
      next(error(err))
    })
}

module.exports = {
  initBooking,
  commitBooking
}

function serializeBooking (req) {
  const busdata = {
    book_ticket: {
      seat_details: {
        seat_detail: []
      },
      contact_detail: req.body.contact
    },
    origin_id: req.data.schedule.origin_id.toString(),
    destination_id: req.data.schedule.destination_id.toString(),
    boarding_at: req.body.boarding_at,
    drop_of: req.body.drop_of,
    no_of_seats: req.data.seats.length.toString(),
    travel_date: req.data.schedule.travel_date.toISOString().split('T')[0]
  }

  if (req.body.hasOwnProperty('gst')) {
    busdata.customer_company_gst = req.body.gst
  }

  req.data.seats.forEach(seat => {
    const seatparam = seat.split('|')
    const seatData = {
      seat_number: seatparam[0],
      fare: seatparam[1],
      name: busdata.book_ticket.contact_detail.emergency_name,
      title: 'Ms',
      age: '1',
      sex: 'F',
      is_primary: 'false',
      id_card_type: '1',
      id_card_number: '111111111',
      id_card_issued_by: 'oneone'
    }

    busdata.book_ticket.seat_details.seat_detail.push(seatData)
  })

  busdata.book_ticket.seat_details.seat_detail[0].is_primary = 'true'
  return busdata
}

/*
transaction
"pnr_number","operator_pnr_number","travel_date","status_code","status","travel_id
","reservation_id","route_id","passenger_name","fare"],
*/

// validate booking
// {"result":{"ticket_details":{"ticket_status":"Confirmed","ticket_number":"TS191127122701563133LOMP","operator_pnr":"12889","travel_operator_pnr":"12889","origin":"Chandigarh","destination":"Bilaspur (Himachal pradesh)","travel_date":"2019-11-27","no_of_seats":1,"seat_numbers":"5","travels":"YoloBus","service_number":"Delhi-Manali","bus_type":"2+2, Volvo Semi Sleeper,AC, Video (41 seats)","dep_time":"11:59 PM","duration":"03:31","boarding_point_details":{"name":"Chandigarh 43","dep_time":"11:59 PM","boarding_stage_address":", Chandigarh 43, Chandigarh, Chandigarh , Pin: 111111","landmark":"Near Bus Stand Chandigarh","contact_numbers":"9773878997 7428798789","stage_id":"263471","op_stage_id":"54"},"agent_ref_number":null,"total_fare":1050,"service_tax_percent":5,"convenience_charge_percent":0,"seat_fare_details":[{"seat_detail":{"seat_number":"5","fare":1000,"api_fare":1000,"our_commission":0,"service_tax":50,"convenience_charge":0,"offer_discount":0,"discount":0,"additional_fare":0,"tieup_agent_commission_percentage":120,"my_commission":120,"our_convenience_charge_amount":0,"seat_type":"SS","transaction_charges":0}}],"commission":120,"passenger_details":{"title":"Ms","gender":null,"name":"Sanan","age":1,"mobile":"9888888888","email":"test@gmail.com"},"commission_percent":0,"tieup_agent_commission_percent":120,"travel_id":3027,"operator_reservation_id":598,"operator_seat_wise_pnr":null,"issued_on":1574837821,"drop_off_details":{"name":"Bilaspur Near bus stand","drop_off_address":", Near bus stand bilaspur, Bilaspur (himachal pradesh), Himachal pradesh , Pin: 111111","landmark":"Near Bus Stand","contact_numbers":"9773878997 7428798789","arrival_time":"","stage_id":"op_61"},"operator_seat_pnr_hash":{},"ts_cancellation_policies":"0-4|100,4-24|75,24-72|25,72-720|5","dropping_point_details":{"name":"Bilaspur Near bus stand","dropping_stage_address":", Near bus stand bilaspur, Bilaspur (himachal pradesh), Himachal pradesh , Pin: 111111","landmark":"Near Bus Stand","contact_numbers":"9773878997 7428798789","stage_id":"241483","op_stage_id":"61"}},"operator_gst_details":{"category":"unregistered","sale_type":"Inter State","trans_type":"Ecommerce","registration_name":"","gst_id":"","cgst_percentage":0,"sgst_percentage":0,"igst_percentage":5,"booking_amount":1000,"cgst_amount":0,"sgst_amount":0,"igst_amount":50}}}
