"use strict";

/* checkbox */
var cb_nighttime = document.getElementById('cb_nighttime');
var cb_holiday = document.getElementById('cb_holiday');
/* text input */

var tx_distance = document.getElementById('tx_distance');
var tx_stop = document.getElementById('tx_stop');
var result = document.getElementsByClassName('result')[0];
/* button */

var bt_stopplus = document.getElementById('bt_stopplus');
var bt_stopminus = document.getElementById('bt_stopminus');
var bt_copy = document.getElementById('bt_copy');
var bt_reset = document.getElementById('bt_reset');
var bt_intro = document.getElementById('bt_intro');
var bt_food = document.getElementById('bt_food');
var bt_pickup = document.getElementById('bt_pickup');
var bt_bills = document.getElementById('bt_bills');
var bt_grocery = document.getElementById('bt_grocery');
var bt_addstore = document.getElementById('bt_addstore');
var bt_waiting = document.getElementById('bt_waiting');
var bt_mabalacat = document.getElementById('bt_mabalacat');
/* default values */

var day_fee = '55.0',
    day_remfee = '15';
var night_fee = '65.0',
    night_remfee = '20';
var errand_fee = day_fee,
    rem_fee = day_remfee;
var stop_fee = 20;
var stops = Number(tx_stop.value);
var preview = '';
/* main array */

var fields = [{
  label: 'First 3km:',
  value: day_fee
}, {
  label: 'Remaining KM:',
  value: 0
}, {
  label: 'Errand Fee:',
  value: errand_fee
}];
/* functions */

var nighttime = function nighttime() {
  if (event.currentTarget.checked) {
    fields.filter(function (obj) {
      return obj.label.includes('First');
    })[0].value = errand_fee = night_fee;
    rem_fee = night_remfee;
  } else {
    fields.filter(function (obj) {
      return obj.label.includes('First');
    })[0].value = errand_fee = day_fee;
    rem_fee = day_remfee;
  }

  calculate();
};

var holiday = function holiday() {
  if (event.currentTarget.checked) {
    fields.splice(3, 0, {
      label: 'Holiday Surcharge (50%):',
      value: 0
    }); // append item on index 4
  } else {
    fields = fields.filter(function (obj) {
      return !obj.label.includes('Holiday');
    });
    if (!fields.filter(function (obj) {
      return obj.label.includes('Stop');
    }).length) fields = fields.filter(function (obj) {
      return !obj.label.includes('Total');
    });
  }

  calculate();
};

var stopover = function stopover() {
  if (event.currentTarget === bt_stopplus) tx_stop.value = stops = stops + 1;else if (stops > 0) tx_stop.value = stops = stops - 1;
  /*
  fields.splice(
      3, // go to index 3
      (fields.filter( obj => obj.label.includes('Stop'))) ? 1 : 0, // delete 1 item
      { label: 'Stop Over:', value: (stops * stop_fee).toFixed(1) } // before adding item
  )
  */

  if (!fields.filter(function (obj) {
    return obj.label.includes('Stop');
  }).length) fields.splice(4, 0, {
    label: 'Stop Over:',
    value: 0
  }); // append item on index 3

  if (!fields.filter(function (obj) {
    return obj.label.includes('Total');
  }).length) fields.push({
    label: 'Total Delivery Cost:',
    value: 0
  }); // if (stops === 0) return fields.splice(3, 1) && calculate()

  if (stops === 0) {
    fields = fields.filter(function (obj) {
      return !obj.label.includes('Stop');
    });
    if (!fields.filter(function (obj) {
      return obj.label.includes('Holiday');
    }).length) fields = fields.filter(function (obj) {
      return !obj.label.includes('Total');
    });
  }

  calculate();
};

var generate_fields = function generate_fields() {
  // remove all fields first if any
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  fields.forEach(function (obj) {
    var new_div = document.createElement('div');
    var first_label = document.createElement('label');
    var second_label = document.createElement('label');
    first_label.innerHTML = obj.label;
    second_label.innerHTML = obj.value;
    new_div.className = 'estimates';
    new_div.append(first_label);
    new_div.append(second_label);
    result.append(new_div);
  });
  tx_distance.focus();
};

var calculate = function calculate() {
  var dist = Number(tx_distance.value);
  var initial = 0,
      rem_cost = 0,
      computed_fee;
  var fld_first = fields.filter(function (obj) {
    return obj.label.includes('First');
  })[0],
      fld_rem = fields.filter(function (obj) {
    return obj.label.includes('Remaining');
  })[0],
      fld_errand = fields.filter(function (obj) {
    return obj.label.includes('Errand');
  })[0],
      fld_stop = fields.filter(function (obj) {
    return obj.label.includes('Stop');
  })[0],
      fld_holiday = fields.filter(function (obj) {
    return obj.label.includes('Holiday');
  })[0],
      fld_total = '';

  if (dist > 3) {
    initial = Number(fld_first.value); // console.log(initial)

    fld_rem.label = "Remaining KM (".concat((dist - 3).toFixed(1), "x").concat(rem_fee, "):");
    rem_cost = parseFloat((dist - 3) * Number(rem_fee)).toFixed(1);
    fld_rem.value = rem_cost; // console.log(rem_cost)

    computed_fee = (Number(initial) + Number(rem_cost)).toFixed(1);
    fld_errand.value = computed_fee; // console.log(errand_fee)
  } else {
    fld_rem.label = "Remaining KM:";
    fld_rem.value = 0;
    fld_errand.value = errand_fee;
  } // if stop or holiday field is present, add total field if not yet added


  if (!fields.filter(function (obj) {
    return obj.label.includes('Total');
  }).length && (fld_stop || fld_holiday)) fields.push({
    label: 'Total Delivery Cost:',
    value: 0
  });
  if (fld_stop) fld_stop.value = (stops * stop_fee).toFixed(1);
  if (fld_holiday) fld_holiday.value = (Number(computed_fee || errand_fee).toFixed(1) * 0.5).toFixed(2);
  var fs = fld_stop ? fld_stop.value : 0;
  var fh = fld_holiday ? fld_holiday.value : 0;
  var fe = computed_fee || errand_fee;
  fld_total = fields.filter(function (obj) {
    return obj.label.includes('Total');
  });
  if (fld_total.length) fld_total[0].value = (Number(fs) + Number(fh) + Number(fe)).toFixed(2); // console.log(Number(fs), Number(fh), Number(fe))

  generate_fields(); // errand fee text

  preview = "".concat(tx_distance.value <= 3 || tx_distance.length === 0 ? 'within 3km' : tx_distance.value + 'km', " distance\n\n");
  fields.forEach(function (obj) {
    return preview += "".concat(obj.label, " ").concat(obj.value, "\n");
  });
};

var copyText = function copyText() {
  var txtar = document.createElement("textarea");
  document.getElementsByTagName("body")[0].append(txtar);
  txtar.value = preview;
  txtar.select();
  document.execCommand("copy");
  txtar.remove();
};

var reset = function reset() {
  tx_stop.value = stops = 0;
  tx_distance.value = '';
  tx_distance.focus(); // remove stop over && total cost

  fields = fields.filter(function (obj) {
    return !obj.label.includes('Stop') && !obj.label.includes('Total');
  });
  calculate();
};

var intro = function intro() {
  preview = "We can assist you with any of the following:\n\u2714\uFE0F Food Delivery (any restaurant within Angeles City, Clark and Mabalacat)\n\u2714\uFE0F Item delivery\n\u2714\uFE0F Grocery (Purchase and Deliver)\n\u2714\uFE0F Mall (Purchase and Deliver)\n\u2714\uFE0F Pick up and Deliver\n\u2714\uFE0F Meet up and Deliver\n\u2714\uFE0F Bills / Payments\n\u2714\uFE0F Other General Errands\n\n*Note: We only charge for the delivery fee. No additional charges for the actual item/order.";
  copyText();
};

var food = function food() {
  preview = "For Food Delivery \u2014-\n\nCustomer Name:\nContact #:\nRestaurant/Food Store Name and Branch(location):\n\nOrder Details (pls provide an alternative if first option is not available):\n\nSpecial Request from Restaurant/Food Store:\n\nDelivery Address and nearest landmark:\n\n***Please expect wait time on food preparation or queue.";
  copyText();
};

var pickup = function pickup() {
  preview = "Pick up & Delivery \u2014-\n\nCustomer Name:\nCustomer Contact #:\nDelivery Address and nearest landmark:\n\nPickup/Meetup Location/Address:\n\nItems for Pickup and Approximate Weight (maximum 5kg):\n\nName of Person and Contact # on Pickup/Meetup location:";
  copyText();
};

var bills = function bills() {
  preview = "Bills/Payments\u2014-\n\nBiller Name/Company:\nAccount Holder Name:\nAccount Number:\nExact amount due for Payment:\n\n***After payment, we will send you a picture of the receipt as a proof. If you prefer to get the physical copy of the receipt, additional fee on delivery (per km delivery rate applies).\n\nPer bill processed is 55PHP";
  copyText();
};

var grocery = function grocery() {
  preview = "Grocery Errand\n- 55PHP for 5 to 7 items (or depends on the weight), more than that will be charged a minimal amount (depending on the items to be added).\n\n- Delivery rate is 55PHP for the first 3km. Succeeding per km is 15PHP. \uD83D\uDE0A\n\n- Maximum of 10kg in weight\n\n- Note: Total Errand fee is computed by\u2014-\nGrocery Errand Fee + Delivery Fee";
  copyText();
};

var addstore = function addstore() {
  preview = "There will be 20PHP per additional store on same errand.";
  copyText();
};

var waiting = function waiting() {
  preview = "Minimum of 15mins for waiting time. Additional 20PHP will be added for more than 15mins.";
  copyText();
};

var mabalacat = function mabalacat() {
  preview = "For Mabalacat area, our base rate starts from Dau Terminal.";
  copyText();
};
/* events */


cb_nighttime.onclick = nighttime;
cb_holiday.onclick = holiday;
bt_stopminus.onclick = stopover;
bt_stopplus.onclick = stopover;
tx_distance.addEventListener('input', calculate);
bt_copy.onclick = copyText;
bt_reset.onclick = reset;
bt_intro.onclick = intro;
bt_food.onclick = food;
bt_pickup.onclick = pickup;
bt_bills.onclick = bills;
bt_grocery.onclick = grocery;
bt_addstore.onclick = addstore;
bt_waiting.onclick = waiting;
bt_mabalacat.onclick = mabalacat;

window.onload = function () {
  return generate_fields();
};