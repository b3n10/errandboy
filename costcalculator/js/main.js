var dist = document.getElementById('distance');
var calc = document.getElementById('calculate');
var rem_dist = document.getElementById('remaining_distance');
var rem_cost = document.getElementById('remaining_cost');
var tot_cost = document.getElementById('total_cost');

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

    s = stop.value * 20;
    t = Number(s) + Number(total.toFixed(2));

    if (d) {
        if (d <= 3) {
            rem_cost.innerHTML = "0";
            stop_cost.innerHTML = "(" + stop.value + "x20) " + s;
            tot_cost.innerHTML = `${cost}php`;
        } else {
            stop_cost.innerHTML = "(" + stop.value + "x20) " + s;
            rem_cost.innerHTML = "(" + remkm.toFixed(1)  + `x${rem}) ` + remcost.toFixed(2);
            tot_cost.innerHTML = t + "php";
        }
    } else {
        rem_cost.innerHTML = "0";
        stop_cost.innerHTML = "(" + stop.value + "x20) 0";
        tot_cost.innerHTML = "0";
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
            txt_res += " " + child.innerHTML.trim();
            child_count++;
        }

        if (child_count === 2) {
            txt_res += "\n";
            child_count = 0;
        }
    });

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
