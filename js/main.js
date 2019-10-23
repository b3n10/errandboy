var dist = document.getElementById('distance');
var calc = document.getElementById('calculate');
var rem_dist = document.getElementById('remaining_distance');
var rem_cost = document.getElementById('remaining_cost');
var tot_cost = document.getElementById('total_cost');

var result = document.getElementsByClassName('result')[0];

var calculate = function() {
    result.style.display = 'block';

    d = Number(dist.value);

    if (d) {
        var firstkm = d - 3;
        rem_dist.innerHTML = firstkm.toFixed(1) + "km: ";

        var remkm = firstkm * 15;
        rem_cost.innerHTML = remkm.toFixed(2);

        var total = remkm + 55;
        tot_cost.innerHTML = total.toFixed(2) + "php";
    }
};

dist.addEventListener('input', calculate)
calc.addEventListener('click', calculate);
