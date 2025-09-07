function main(log = false, logAll = false) {
    const start = Date.now();
    const { step, perP, min1, min2, max1, max2, l1, l2, o1, o2, f1, f2, c1, c2, c1ol, c2ol } =
        getVars();
    const perPfn =  (perP && (f1 || f2)) ? (
        f1 && f2 ? (
            (i, ii) => i + ii
        ) : (
            f1 ? (
                (i, ii) => i
            ) : (
                (i, ii) => ii
            )
        )
    ) : (
        (i, ii) => 1
    );
    const emax1 = l1 ? round(max1 / (o1 - 1)) : max1;
    const emax2 = l2 ? round(max2 / (o2 - 1)) : max2;

    if (log) console.log(JSON.stringify({ step, perP, min1, min2, max1, max2, emax1, emax2, l1, l2, o1, o2, f1, f2, c1, c2, c1ol, c2ol }, null, 2));

    const list = [];
    for (let i = min1; i <= emax1; i += step) {
        const list2 = [];
        for (let ii = min2; ii <= emax2; ii += step) {
            /* First */
            let p1 = l1 ? o1 : (o1 * i - i);
            if (c1 > 0 && (p1 > 0 || c1ol)) p1 *= (100 - c1) / 100;
            if (!f2) p1 -= ii;

            /* Second */
            let p2 = l2 ? o2 : (o2 * ii - ii);
            if (c2 > 0 && (p2 > 0 || c2ol)) p2 *= (100 - c2) / 100;
            if (!f1) p2 -= i;

            list2.push({
                s1: round(i),
                s2: round(ii),
                p: round(Math.min(p1, p2) / perPfn(i, ii)),
            });
        }
        if (logAll) console.log(list2);
        list.push(getMax(list2));
    }
    if (logAll) console.log(list);
    const best = getMax(list);
    if (log) console.log(best);
    const end = Date.now();
    display(
        `s1: £${best.s1.toFixed(2)}, s2: £${best.s2.toFixed(
            2
        )}, p: £${best.p.toFixed(2)}, Time spent: ${humanify(start, end)}`
    );
}

function display(result) {
    getEl('result').innerHTML = result;
}

function getVars() {
    return {
        step: parseFloat(getEl('step')?.value || 0.10),
        perP: Boolean(getEl('per-p')?.checked || false),
        min1: parseFloat(getEl('min1')?.value || 0.1) ,
        min2: parseFloat(getEl('min2')?.value || 0.1),
        max1: parseFloat(getEl('max1')?.value || 10),
        max2: parseFloat(getEl('max2')?.value || 10),
        l1: Boolean(getEl('l1')?.checked || false),
        l2: Boolean(getEl('l2')?.checked || false),
        o1: parseFloat(getEl('o1')?.value),
        o2: parseFloat(getEl('o2')?.value),
        f1: Boolean(getEl('f1')?.checked || false),
        f2: Boolean(getEl('f2')?.checked || false),
        c1: parseInt(getEl('c1')?.value || 0),
        c2: parseInt(getEl('c2')?.value || 0),
        c1ol: Boolean(getEl('c1.1')?.checked || false),
        c2ol: Boolean(getEl('c2.1')?.checked || false),
    };
}

function round(num, dp = 2) {
    const by = Math.pow(10, dp);
    return Math.round(num * by) / by;
}

function getMax(list) {
    if (list.length === 0) return;
    if (list.length === 1) return list[0];
    function compare(current, next) {
        if (current.p < next.p) return next;
        return current;
    }
    return list.reduce(compare);
}

function humanify(d1, d2) {
    let time = d2 - d1;
    const mins = Math.floor(time / (60 * 1000));
    time -= mins * 60 * 1000;
    const secs = Math.floor(time / 1000);
    time -= secs * 1000;
    const ms = time;
    const list = [];
    if (mins > 0) list.push(mins + 'm');
    if (secs > 0) list.push(secs + 's');
    if (ms > 0) list.push(ms + 'ms');
    if (list.length === 0) return 'instant';
    if (list.length === 1) return list[0];
    return list.slice(-1).join(', ') + ' and ' + list[list.length - 1];
}

function getEl(name) {
    return document.getElementById(name);
}
