function hook (req, res, next) {
  switch (req.body.action_type) {
    case 'MANUAL_BUS_CANCELLATION':
      console.log('1')
      break
    case 'SCHEDULE_SERVICE':
      console.log('21')
      break
    case 'OPERATOR_CANCEL_POLICY_CHANGE':
      console.log('3')
      break
    case 'CITY_CHANGE':
      console.log('4')
      break
    case 'STAGE_CHANGE':
      console.log('5')
  }
}

function busCancel (data) {
    // action_type = MANUAL_BUS_CANCELLATION(Whenever bus cancelled by
    //     operator those details will be sent)
    //     Format = ["POST", "http:// ticketsimply.com/bus/bitla /tscallback", 68,
    //     "{"pnr_number":["Operator_pnr_number",["seat_number",Cancellation_p
    //     ercentage,"Remarks"]]}", "MANUAL_BUS_CANCELLATION"]
}

function schedule (data) {
    // action_type = SCHEDULE_SERVICE(Except booking and cancellation all
    //     changes like Fare changes,Pickup Point changes,Timing Changes,New
    //     stations added/Deleted,Service blocking/unblocking,coach change
    //     will be sent)
    //     Format = ["POST", "http:// ticketsimply.com/bus/bitla /tscallback", 68,
    //     "{"Travel_id":"Schedule_ids","Travel_id":"Schedule_ids"}"]
}

function operatorPolicy (data) {
    // action_type = OPERATOR_CANCEL_POLICY_CHANGE (Whenever cancellation
    //     policy is changes by any operator)
    //     Format = ["POST", "http:// ticketsimply.com/bus/bitla /tscallback", 68,
    //     [Travel_id,Travel_id]

function cityUpdate (data) {
    // action_type = CITY_CHANGE (Whenever the new destination added)
    // Format = ["POST", "http:// ticketsimply.com/bus/bitla /tscallback", 68,
    // [city_id,city_id] #Call the cities API for the Latest Info
}

function stageUpdate (data) {
    // action_type = STAGE_CHANGE (Whenever the new stage added)
    // Format = ["POST", "http:// ticketsimply.com/bus/bitla /tscallback", 68,
    // [stage_id,stage_id] #Call the Stages API for the Latest Info
}

module.exports = {
  hook
}
