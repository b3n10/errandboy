/* main array */

const fields = [
    { label: 'First 3km:', value: '55.00' },
    { label: 'Remaining KM:', addin: '', value: 0 },
    { label: 'Errand Fee:', value: '55.00' },
]

/* dom elements */

const cb_nighttime = document.getElementById('cb_nighttime')
const cb_holiday = document.getElementById('cb_holiday')
const tx_distance = document.getElementById('tx_distance')
const tx_stop = document.getElementById('tx_stop')
const bt_stopplus = document.getElementById('bt_stopplus')
const bt_stopminus = document.getElementById('bt_stopminus')
const result = document.getElementsByClassName('result')[0]
const bt_copy = document.getElementById('bt_copy')

/* default values */

const day_fee = '55.00', day_remfee = '15'
const night_fee = '65.00', night_remfee = '20'
let rem_fee = day_remfee
const stop_fee = 20

/* functions */

const stopover = () => {
    let stops = Number(tx_stop.value)

    if (event.currentTarget === bt_stopminus || stops === 1) {
        tx_stop.value = stops = 0
        fields.splice(3, 1)
    } else {
        if (event.currentTarget === bt_stopplus)
            tx_stop.value = stops = stops + 1
        else
            if (stops > 0)
                tx_stop.value = stops = stops - 1

        fields.splice(
            3,
            (fields.findIndex( obj => obj.label.includes('Stop') ) > 0) ? 1 : 0,
            { label: 'Stop Over:', value: stops * stop_fee}
        )
    }

    generate_fields()
}

const generate_fields = () => {
    // remove all fields first if any
    while (result.firstChild) {
        result.removeChild(result.firstChild)
    }

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
}

const calculate = () => {
    const dist = Number(tx_distance.value)
    let initial = 0, rem_cost = 0, errand_fee = 0

    if (dist > 3) {
        initial = Number(fields.filter(obj => obj.label.includes('First'))[0].value)
        // console.log(initial)

        fields.filter(obj => obj.label.includes('Remaining'))[0].label = `Remaining KM (${(dist - 3).toFixed(1)}x${rem_fee}):`
        rem_cost = parseFloat((dist - 3) * Number(rem_fee)).toFixed(2)
        fields.filter(obj => obj.label.includes('Remaining'))[0].value = rem_cost
        // console.log(rem_cost)

        errand_fee = (Number(initial) + Number(rem_cost)).toFixed(2)
        fields.filter(obj => obj.label.includes('Errand'))[0].value = errand_fee
        // console.log(errand_fee)
    } else {
        fields.filter(obj => obj.label.includes('Remaining'))[0].label = `Remaining KM:`
        fields.filter(obj => obj.label.includes('Remaining'))[0].value = 0
        fields.filter(obj => obj.label.includes('Errand'))[0].value = '55.00'
    }

    generate_fields()
}

/* events */

cb_nighttime.onclick = () => {
    if (event.currentTarget.checked) {
        fields[0].value = night_fee
        rem_fee = night_remfee
    } else {
        fields[0].value = day_fee
        rem_fee = day_remfee
    }

    calculate()
}

cb_holiday.onclick = () => {
    if (event.currentTarget.checked) {
        fields.push({
            label: 'Holiday Surcharge:',
            value: 0
        }, {
            label: 'Total Delivery Cost',
            value: 0
        })
    } else {
        fields.pop(fields.find( obj => obj.label === 'Holiday Surcharge'))
        fields.pop(fields.find( obj => obj.label === 'Total Delivery Cost'))
    }
    generate_fields()
}

bt_stopminus.onclick = stopover
bt_stopplus.onclick = stopover

tx_distance.addEventListener('input', calculate)

bt_copy.onclick = () => {
    let preview = ''

    fields.forEach( obj => {
        preview += `${obj.label} ${obj.value}\n`
    })

    const txtar = document.createElement("textarea")
    document.getElementsByTagName("body")[0].append(txtar);
    txtar.value = preview
    txtar.select();
    document.execCommand("copy");
    txtar.remove();
}

window.onload = () => generate_fields()
