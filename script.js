const min = 0.10;
const max = 50;
const step = 0.10;

const steps = Math.round((max / step) - (min / step));
const total = Math.pow(steps, 2);

function main(log = false) {
  const start = Date.now();
  const { o1, o2 } = getOs();

  const list = [];
  for (let i = min; i <= max; i += step) {
    const list2 = [];
    for (let ii = min; ii <= max; ii += step) {
      const p1 = round((o1 * i) - i - ii);
      const p2 = round((o2 * ii) - i - ii);
      list2.push({ s1: round(i), s2: round(ii), p: Math.min(p1, p2), p1, p2, step1: [o1*i, (o1*i)-i-ii], step2: [o2*ii, (o2*ii)-i-ii], iii: -i-ii });
    }
    if (log) console.log(list2);
    list.push(getMax(list2));
  }
  if (log) console.log(list);
  const best = getMax(list);
  const end = Date.now();
  display(`s1: £${best.s1.toFixed(2)}, s2: £${best.s2.toFixed(2)}, p: £${best.p.toFixed(2)}, Time spent: ${humanify(start, end)}`);
}

function display(result) {
 getEl('result').innerHTML = result;
}

function getOs() {
  const o1 = parseFloat(getEl('o1').value);
  const o2 = parseFloat(getEl('o2').value);
  return { o1, o2 };
}

function round(num, dp = 2) {
  const by = Math.pow(10, dp);
  return Math.round(num * by) / by;
}

function getMax(list) {
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
