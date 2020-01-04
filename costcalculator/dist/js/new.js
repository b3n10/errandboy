"use strict";

var fields = [{
  label: 'First 3km:',
  value: 55
}, {
  label: 'Succeeding KM:',
  value: 0
}, {
  label: 'Errand Fee:',
  value: 0
}];
var result = document.getElementsByClassName('result')[0];
var cb_nighttime = document.getElementById('cb_nighttime');
var cb_holiday = document.getElementById('cb_holiday');
var bt_copy = document.getElementById('bt_copy');

var create_fields = function create_fields() {
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

cb_nighttime.onclick = function () {
  if (event.currentTarget.checked) {
    fields[0].value = 65;
  } else {
    fields[0].value = 55;
  }

  create_fields();
};

cb_holiday.onclick = function () {
  if (event.currentTarget.checked) {
    fields.push({
      label: 'Holiday Surcharge:',
      value: 0
    }, {
      label: 'Total Delivery Cost',
      value: 0
    });
  } else {
    fields.pop(fields.find(function (obj) {
      return obj.label === 'Holiday Surcharge';
    }));
    fields.pop(fields.find(function (obj) {
      return obj.label === 'Total Delivery Cost';
    }));
  }

  create_fields();
};

bt_copy.onclick = function () {
  var preview = '';
  fields.forEach(function (obj) {
    preview += "".concat(obj.label, " ").concat(obj.value, "\n");
  });
  var txtar = document.createElement("textarea");
  document.getElementsByTagName("body")[0].append(txtar);
  txtar.value = preview;
  txtar.select();
  document.execCommand("copy");
  txtar.remove();
};

window.onload = function () {
  return create_fields();
};