/* dom elements */
const cb_nighttime = document.getElementById('cb_nighttime')
const cb_holiday = document.getElementById('cb_holiday')
const tx_distance = document.getElementById('tx_distance')
const tx_stop = document.getElementById('tx_stop')
const bt_stopplus = document.getElementById('bt_stopplus')
const bt_stopminus = document.getElementById('bt_stopminus')
const result = document.getElementsByClassName('result')[0]
const bt_copy = document.getElementById('bt_copy')
const bt_reset = document.getElementById('bt_reset')

/* default values */
const day_fee = '55.0', day_remfee = '15'
const night_fee = '65.0', night_remfee = '20'
let errand_fee = day_fee, rem_fee = day_remfee
const stop_fee = 20
let stops = Number(tx_stop.value)

/* main array */
let fields = [
    { label: 'First 3km:', value: day_fee },
    { label: 'Remaining KM:', value: 0 },
    { label: 'Errand Fee:', value: errand_fee },
]


/* functions */
const nighttime = () => {
    if (event.currentTarget.checked) {
        fields.filter(obj => obj.label.includes('First'))[0].value = errand_fee = night_fee
        rem_fee = night_remfee
    } else {
        fields.filter(obj => obj.label.includes('First'))[0].value = errand_fee = day_fee
        rem_fee = day_remfee
    }

    calculate()
}

const holiday = () => {
    if (event.currentTarget.checked) {
        fields.splice(3, 0, {label: 'Holiday Surcharge (50%):', value: 0}) // append item on index 4
        if (! fields.filter(obj => obj.label.includes('Total')).length)
            fields.push({label: 'Total Delivery Cost:', value: 0})
    } else {
        fields = fields.filter(obj => !obj.label.includes('Holiday'))
        if (! fields.filter(obj => obj.label.includes('Stop')).length)
            fields = fields.filter(obj => !obj.label.includes('Total'))
    }

    calculate()
}

const stopover = () => {
    if (event.currentTarget === bt_stopplus)
        tx_stop.value = stops = stops + 1
    else
        if (stops > 0) tx_stop.value = stops = stops - 1

    /*
    fields.splice(
        3, // go to index 3
        (fields.filter( obj => obj.label.includes('Stop'))) ? 1 : 0, // delete 1 item
        { label: 'Stop Over:', value: (stops * stop_fee).toFixed(1) } // before adding item
    )
    */

    if (! fields.filter(obj => obj.label.includes('Stop')).length)
        fields.splice(4, 0, {label: 'Stop Over:', value: 0}) // append item on index 3

    if (! fields.filter(obj => obj.label.includes('Total')).length)
        fields.push({label: 'Total Delivery Cost:', value: 0})

    // if (stops === 0) return fields.splice(3, 1) && calculate()
    if (stops === 0) {
        fields = fields.filter(obj => !obj.label.includes('Stop'))
        if (! fields.filter(obj => obj.label.includes('Holiday')).length)
            fields = fields.filter(obj => !obj.label.includes('Total'))
    }

    calculate()
}

const generate_fields = () => {
    // remove all fields first if any
    while (result.firstChild)
        result.removeChild(result.firstChild)

    fields.forEach( obj => {
        const new_div = document.createElement('div')
        const first_label = document.createElement('label')
        const second_label = document.createElement('label')

        first_label.innerHTML = obj.label
        second_label.innerHTML = obj.value

        new_div.className = 'estimates'
        new_div.append(first_label)
        new_div.append(second_label)
        result.append(new_div)
    })

    tx_distance.focus()
}

const calculate = () => {
    const dist = Number(tx_distance.value)
    let initial = 0, rem_cost = 0, computed_fee
    let fld_first = fields.filter(obj => obj.label.includes('First'))[0],
        fld_rem = fields.filter(obj => obj.label.includes('Remaining'))[0],
        fld_errand = fields.filter(obj => obj.label.includes('Errand'))[0],
        fld_stop = fields.filter(obj => obj.label.includes('Stop'))[0],
        fld_holiday = fields.filter(obj => obj.label.includes('Holiday'))[0],
        fld_total = ''

    if (dist > 3) {
        initial = Number(fld_first.value)
        // console.log(initial)

        fld_rem.label = `Remaining KM (${(dist - 3).toFixed(1)}x${rem_fee}):`
        rem_cost = parseFloat((dist - 3) * Number(rem_fee)).toFixed(1)
        fld_rem.value = rem_cost
        // console.log(rem_cost)

        computed_fee = (Number(initial) + Number(rem_cost)).toFixed(1)
        fld_errand.value = computed_fee
        // console.log(errand_fee)
    } else {
        fld_rem.label = `Remaining KM:`
        fld_rem.value = 0
        fld_errand.value = errand_fee
    }

    if (fld_stop)
        fld_stop.value = (stops * stop_fee).toFixed(1)

    if (fld_holiday)
        fld_holiday.value = (Number(computed_fee || errand_fee).toFixed(1) * 0.5).toFixed(2)

    let fs = (fld_stop) ? fld_stop.value : 0
    let fh = (fld_holiday) ? fld_holiday.value : 0
    let fe = (computed_fee || errand_fee)

    fld_total = fields.filter(obj => obj.label.includes('Total'))
    if (fld_total.length)
        fld_total[0].value = (Number(fs) + Number(fh) + Number(fe)).toFixed(2)

    // console.log(Number(fs), Number(fh), Number(fe))

    generate_fields()
}

const copyText = () => {
    let preview = `${(tx_distance.value <= 3 || tx_distance.length === 0) ? 'within 3km' : tx_distance.value + 'km'} distance\n\n`

    fields.forEach( obj => preview += `${obj.label} ${obj.value}\n` )

    const txtar = document.createElement("textarea")
    document.getElementsByTagName("body")[0].append(txtar);
    txtar.value = preview
    txtar.select();
    document.execCommand("copy");
    txtar.remove();
}

const reset = () => {
    tx_stop.value = stops = 0

    tx_distance.value = ''
    tx_distance.focus()

    // remove stop over
    fields = fields.filter(obj => !obj.label.includes('Stop'))

    calculate()
}

/* events */

cb_nighttime.onclick = nighttime
cb_holiday.onclick = holiday

bt_stopminus.onclick = stopover
bt_stopplus.onclick = stopover

tx_distance.addEventListener('input', calculate)

bt_copy.onclick = copyText
bt_reset.onclick = reset

window.onload = () => generate_fields()
