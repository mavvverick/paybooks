// Referral Discount calc logic
// Agent commision logic
// Agent rewards logic
// Calculate amount for refund logic

function getUnixTime (dateStr) {
  return new Date(dateStr).getTime() / 1000 | 0
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

module.exports = {
  serializeBooking
}
