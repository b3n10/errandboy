"use strict";

/* dom elements */
var cb_nighttime = document.getElementById('cb_nighttime');
var cb_holiday = document.getElementById('cb_holiday');
var tx_distance = document.getElementById('tx_distance');
var tx_stop = document.getElementById('tx_stop');
var bt_stopplus = document.getElementById('bt_stopplus');
var bt_stopminus = document.getElementById('bt_stopminus');
var result = document.getElementsByClassName('result')[0];
var bt_copy = document.getElementById('bt_copy');
/* default values */

var day_fee = '55.0',
    day_remfee = '15';
var night_fee = '65.0',
    night_remfee = '20';
var errand_fee = day_fee,
    rem_fee = day_remfee;
var stop_fee = 20;
var stops = Number(tx_stop.value);
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

    if (!fields.filter(function (obj) {
      return obj.label.includes('Total');
    }).length) fields.push({
      label: 'Total Delivery Cost:',
      value: 0
    });
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
    label: 'Stop Over',
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
  }

  if (fld_stop) fld_stop.value = (stops * stop_fee).toFixed(1);
  if (fld_holiday) fld_holiday.value = (Number(computed_fee || errand_fee).toFixed(1) * 0.5).toFixed(2);
  var fs = fld_stop ? fld_stop.value : 0;
  var fh = fld_holiday ? fld_holiday.value : 0;
  var fe = computed_fee || errand_fee;
  fld_total = fields.filter(function (obj) {
    return obj.label.includes('Total');
  });
  if (fld_total.length) fld_total[0].value = (Number(fs) + Number(fh) + Number(fe)).toFixed(2); // console.log(Number(fs), Number(fh), Number(fe))

  generate_fields();
};

var copyText = function copyText() {
  var preview = "".concat(tx_distance.value ? tx_distance.value + 'km' : 'within 3km', " distance\n\n");
  fields.forEach(function (obj) {
    return preview += "".concat(obj.label, " ").concat(obj.value, "\n");
  });
  var txtar = document.createElement("textarea");
  document.getElementsByTagName("body")[0].append(txtar);
  txtar.value = preview;
  txtar.select();
  document.execCommand("copy");
  txtar.remove();
};
/* events */


cb_nighttime.onclick = nighttime;
cb_holiday.onclick = holiday;
bt_stopminus.onclick = stopover;
bt_stopplus.onclick = stopover;
tx_distance.addEventListener('input', calculate);
bt_copy.onclick = copyText;

window.onload = function () {
  return generate_fields();
};