$('#add').on("click", addEntry);
$('#calculate').on("click", calculate);

function parseTime(time) {
    let i = time.search(":");
    if (i >= 0) {
        return (
            parseFloat(time.substring(0, i)) * 60 +
            parseFloat(time.substring(i + 1))
        );
    } else {
        return parseFloat(time);
    }
}

let nEntries = 0;

function addEntry() {
    let i = nEntries;
    let id = `entry-${i}`;
    $('#entries').append(
        `<div class="entry" id="${id}">
            <input type="text" class="text-box-1 reps" value="1">
            <p>x</p>
            <input type="text" class="text-box-2 distance">
            <select class="text-box-2 unit">
                <option value="mi">mi</option>
                <option value="m">m</option>
                <option value="km">km</option>
            </select>
            <p>@</p>
            <input type="text" class="text-box-1 time" id="time-0">
            <button class="toggle-off pace-toggle">/mi</button>
        </div>`
    );

    $(`#${id} .pace-toggle`).on("click", ((entryIndex) => {
        return () => {
            togglePace(entryIndex);
        };
    })(i));

    $(`#${id} .reps`).on("change", () => {
        $(`#${id} .time`).remove();
        $(`#${id} .pace-toggle`).remove();
        for (let j = 0; j < parseInt($(`#${id} .reps`).val()); j++) {
            $(`#${id}`).append(
                `<input type="text" class="text-box-1 time" id="time-${j}">`
            );
        }
        $(`#${id}`).append('<button class="toggle-off pace-toggle">/mi</button>');
        $(`#${id} .pace-toggle`).on("click", ((entryIndex) => {
            return () => {
                togglePace(entryIndex);
            };
        })(i));
    })
    nEntries++;

    updateCalcOnChanges();
}

function updateCalcOnChanges() {
    $('input').on("change", calculate);
    $('select').on("change", calculate);
    $('.pace-toggle').on("click", calculate);
}

function togglePace(i) {
    let elem = $(`#entry-${i} .pace-toggle`);
    if (elem.hasClass("toggle-on")) {
        elem.removeClass("toggle-on");
        elem.addClass("toggle-off");
    } else {
        elem.removeClass("toggle-off");
        elem.addClass("toggle-on");
    }
}

function calculate() {
    let dist = 0, time = 0;

    for (let i = 0; i < nEntries; i++) {
        let d = 0, t = 0;

        let unit = $(`#entry-${i} .unit`).val();
        let dVal = parseFloat($(`#entry-${i} .distance`).val());
        let reps = parseInt($(`#entry-${i} .reps`).val());
        if (unit == "mi") d = dVal;
        else if (unit == "m") d = dVal / 1609.34;
        else if (unit == "km") d = dVal / 1.60934;
        d *= reps;

        for (let j = 0; j < reps; j++) {
            t += parseTime($(`#entry-${i} #time-${j}`).val());
        }
        if ($(`#entry-${i} .pace-toggle`).hasClass("toggle-on")) {
            t *= d;
        }

        dist += d;
        time += t;
    }

    if (isNaN(dist) || isNaN(time)) {
        $('#result').html("");
        return;
    }

    let pace = time / dist;
    let paceStr = `${Math.floor(pace / 60.0)}:${pace % 60 < 10 ? "0" : ""}${Math.round(pace % 60)}`;
    $('#result').html(`${dist.toFixed(2)} mi @ ${paceStr}`);
}

addEntry();