var dist = document.getElementById('distance');
var calc = document.getElementById('calculate');
var rem_dist = document.getElementById('remaining_distance');
var rem_cost = document.getElementById('remaining_cost');
var tot_cost = document.getElementById('total_cost');

var stop = document.getElementById('stop');
var sp = document.getElementById('stop_plus');
var sm = document.getElementById('stop_minus');
var st_cost = document.getElementById('stop_cost');

var result = document.getElementsByClassName('result')[0];

var calculate = function() {
    result.style.display = 'block';

    d = Number(dist.value);

    var remkm = d - 3;
    var remcost = remkm * 15;
    var total = remcost + 55;

    s = stop.value * 20;
    t = Number(s) + Number(total.toFixed(2));

    if (d) {
        if (d <= 3) {
            rem_cost.innerHTML = "0";
            stop_cost.innerHTML = "(" + stop.value + "x20) " + s;
            tot_cost.innerHTML = t + "php";
        } else {

            stop_cost.innerHTML = "(" + stop.value + "x20) " + s;
            rem_cost.innerHTML = "(" + remkm.toFixed(1)  + "x15) " + remcost.toFixed(2);
            tot_cost.innerHTML = t + "php";
        }
    }
};

var stop_over = function() {
    var s = Number(stop.value);
    var div_stop = document.getElementsByClassName('stop_text')[0];

    if (this === sp) {
        stop.value = s + 1;
        div_stop.style.display = 'block';
    } else {
        if (Number(stop.value) != 0) {
            stop.value = s - 1;
            div_stop.style.display = 'none';
        }
    }
    calculate();
};

dist.addEventListener('input', calculate)
sp.onclick = stop_over;
sm.onclick = stop_over;
