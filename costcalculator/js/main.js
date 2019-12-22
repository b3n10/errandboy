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
var n = undefined;

window.onload = function() {
    n = dt.getHours();
    spc.innerHTML = (n >= 21 || n <= 5) ? "65" : "55";
};

var calculate = function() {
    d = Number(dist.value);

    n = dt.getHours();

    var rem = (n >= 21 || n <= 5) ? 20 : 15;
    console.log(rem);
    var cost = (n >= 21 || n <= 5) ? 65 : 55;
    console.log(cost);

    var remkm = d - 3;
    var remcost = remkm * rem;
    var total = remcost + cost;
    var h_cost = (total * 0.50).toFixed(0);

    s = stop.value * 20;
    t = Number(s) + Number(total.toFixed(2));

    if (d) {
        if (d <= 3) {
            rem_cost.innerHTML = "0";
            stop_cost.innerHTML = "(" + stop.value + "x20) " + s;
            errand_fee.innerHTML = `${cost}php`;
            holiday_surcharge.innerHTML = h_cost;
            total_cost.innerHTML = parseInt(cost) + parseInt(h_cost);
        } else {
            stop_cost.innerHTML = "(" + stop.value + "x20) " + s;
            rem_cost.innerHTML = "(" + remkm.toFixed(1)  + `x${rem}) ` + remcost.toFixed(2);
            errand_fee.innerHTML = `${t}php`;
            holiday_surcharge.innerHTML = h_cost;
            total_cost.innerHTML = parseInt(t) + parseInt(h_cost);
        }
    } else {
        rem_cost.innerHTML = "0";
        stop_cost.innerHTML = "(" + stop.value + "x20) 0";
        errand_fee.innerHTML = "0";
        holiday_surcharge.innerHTML = "0";
        total_cost.innerHTML = "0";
    }
};

var stop_over = function() {
    var s = Number(stop.value);
    var stx = document.getElementsByClassName('stop_text');
    var stx_array = Array.from(stx);

    if (this === sp) {
        stop.value = s + 1;
        stx_array.forEach(n => n.style.display = 'inline-block');
    } else {
        if (Number(stop.value) > 0) {
            stop.value = s - 1;

            if (Number(stop.value) <= 0) {
                stx_array.forEach(n => n.style.display = 'none');
            }
        }

    }
    calculate();
};

var copy_result = function() {
    var txt_res = "";
    var prev_node = "";
    var child_count = 0;

    txt_res = dist.value + "km distance\n\n";

    resc.forEach(function(child) {
        if (child.innerHTML != "" && window.getComputedStyle(child).display != 'none') {
            txt_res += child.innerHTML.trim() + " ";
            child_count++;
        }

        if (child_count === 2) {
            txt_res += "\n";
            child_count = 0;
        }
    });

    // txt_res += "\n*Surcharge fee applies on every errand starting Dec 21 to Jan 2 only."

    /* only way to copy this text is to paste in text element */
    var d = document.createElement("textarea");
    document.getElementsByTagName("body")[0].append(d);
    d.value = txt_res;
    d.select();
    document.execCommand("copy");
    d.remove();
    console.log(txt_res);
};

dist.addEventListener('input', calculate)
sp.onclick = stop_over;
sm.onclick = stop_over;
cp.onclick = copy_result;
