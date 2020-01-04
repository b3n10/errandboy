const fields = [
    { label: 'First 3km:', value: 55 },
    { label: 'Succeeding KM:', value: 0 },
    { label: 'Errand Fee:', value: 0 },
]

const result = document.getElementsByClassName('result')[0]
const cb_nighttime = document.getElementById('cb_nighttime')
const cb_holiday = document.getElementById('cb_holiday')
const bt_copy = document.getElementById('bt_copy')

const create_fields = () => {
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

cb_nighttime.onclick = () => {
    if (event.currentTarget.checked) {
        fields[0].value = 65
    } else {
        fields[0].value = 55
    }

    create_fields()
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
    create_fields()
}

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

window.onload = () => create_fields()
