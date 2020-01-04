"use strict";

var cb_nighttime = document.getElementById('cb_nighttime');
var dist = document.getElementById('distance');
var calc = document.getElementById('calculate');
var rem_dist = document.getElementById('remaining_distance');
var rem_cost = document.getElementById('remaining_cost');
var errand_fee = document.getElementById('errand_fee');
var holiday_surcharge = document.getElementById('holiday_surcharge');
var total_cost = document.getElementById('total_cost');
var stop = document.getElementById('stop');
var sp = document.getElementById('stop_plus');
var sm = document.getElementById('stop_minus');
var st_cost = document.getElementById('stop_cost');
var spc = document.getElementById('span_cost');
var result = document.getElementsByClassName('result')[0];
var resc = Array.from(result.children);
var hd_res = document.getElementById('hd_res');
var cp = document.getElementById('btn_copy');
var dt = new Date();
var n = undefined; // initial value (daytime)

var rem = 15;
var cost = 55; // nighttime flag

var nighttime = false;

window.onload = function () {
  // n = dt.getHours();
  spc.innerHTML = "55";
};

var calculate = function calculate() {
  d = Number(dist.value);
  n = dt.getHours(); // var rem = (n >= 21 || n <= 5) ? 20 : 15;
  // console.log(rem);
  // var cost = (n >= 21 || n <= 5) ? 65 : 55;
  // console.log(cost);

  var remkm = d - 3; // console.log(`remkm: ${remkm}`);

  var remcost = remkm <= 0 ? 0 : remkm * rem; // console.log(`remcost: ${remcost}`);

  var total = remcost + cost; // console.log(`total: ${total}`);

  var h_cost = (total * 0.50).toFixed(2);
  var s = stop.value * 20;
  var t = Number(s) + Number(total.toFixed(2));

  if (d) {
    if (d <= 3) {
      rem_cost.innerHTML = "0";
      stop_cost.innerHTML = "(" + stop.value + "x20) " + s;
      errand_fee.innerHTML = "".concat(cost); // holiday_surcharge.innerHTML = h_cost;
      // total_cost.innerHTML = `₱${(parseInt(cost) + parseInt(h_cost))}`;
    } else {
      stop_cost.innerHTML = "(" + stop.value + "x20) " + s;
      rem_cost.innerHTML = "(" + remkm.toFixed(2) + "x".concat(rem, ") ") + remcost.toFixed(2);
      errand_fee.innerHTML = "".concat(t); // holiday_surcharge.innerHTML = h_cost;
      // total_cost.innerHTML = `₱${(parseFloat(t) + parseFloat(h_cost))}`;
    }
  } else {
    rem_cost.innerHTML = "0";
    stop_cost.innerHTML = "(" + stop.value + "x20) 0";
    errand_fee.innerHTML = "0"; // holiday_surcharge.innerHTML = "0";
    // total_cost.innerHTML = "0";
  }
};

var stop_over = function stop_over() {
  var s = Number(stop.value);
  var stx = document.getElementsByClassName('stop_text');
  var stx_array = Array.from(stx);

  if (this === sp) {
    stop.value = s + 1;
    stx_array.forEach(function (n) {
      return n.style.display = 'inline-block';
    });
  } else {
    if (Number(stop.value) > 0) {
      stop.value = s - 1;

      if (Number(stop.value) <= 0) {
        stx_array.forEach(function (n) {
          return n.style.display = 'none';
        });
      }
    }
  }

  calculate();
};

var copy_result = function copy_result() {
  var txt_res = "";
  var prev_node = "";
  var child_count = 0;
  txt_res = dist.value + "km distance\n\n";
  resc.forEach(function (child) {
    if (child.innerHTML != "" && window.getComputedStyle(child).display != 'none') {
      txt_res += child.innerHTML.trim() + " ";
      child_count++;
    }

    if (child_count === 2) {
      txt_res += "\n";
      child_count = 0;
    }
  }); // txt_res += "\n*Surcharge fee applies on every errand starting Dec 21 to Jan 2 only."

  /* only way to copy this text is to paste in text element */

  var d = document.createElement("textarea");
  document.getElementsByTagName("body")[0].append(d);
  d.value = txt_res;
  d.select();
  document.execCommand("copy");
  d.remove();
  console.log(txt_res);
};

cb_nighttime.onclick = function () {
  if (!nighttime) {
    spc.innerHTML = "65";
    rem = 20;
    cost = 65;
    nighttime = true;
  } else {
    spc.innerHTML = "55";
    rem = 15;
    cost = 55;
    nighttime = false;
  }

  calculate();
};

dist.addEventListener('input', calculate);
sp.onclick = stop_over;
sm.onclick = stop_over;
cp.onclick = copy_result;