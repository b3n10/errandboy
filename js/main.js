var dist = document.getElementById('distance');
var calc = document.getElementById('calculate');
var rem_dist = document.getElementById('remaining_distance');
var rem_cost = document.getElementById('remaining_cost');
var tot_cost = document.getElementById('total_cost');

var stop = document.getElementById('stop');
var sp = document.getElementById('stop_plus');
var sm = document.getElementById('stop_minus');

var result = document.getElementsByClassName('result')[0];

var calculate = function() {
    result.style.display = 'block';

    d = Number(dist.value);

    if (d) {
        if (d <= 3) {
            rem_dist.innerHTML = "0km: ";
            rem_cost.innerHTML = "0";
            tot_cost.innerHTML = "55php";
        } else {
            var firstkm = d - 3;
            rem_dist.innerHTML = firstkm.toFixed(1) + "km: ";

            var remkm = firstkm * 15;
            rem_cost.innerHTML = remkm.toFixed(2);

            var total = remkm + 55;
            tot_cost.innerHTML = total.toFixed(2) + "php";
        }
    }
};

var stop_over = function() {
    var s = Number(stop.value);

    if (this === sp) {
        stop.value = s + 1;
    } else {
        if (s != 0)
            stop.value = s - 1;
    }
};

dist.addEventListener('input', calculate)
sp.onclick = stop_over;
sm.onclick = stop_over;
