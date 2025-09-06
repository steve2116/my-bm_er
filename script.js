const vars = {
  min: 0.1,
  max: 10,
  step: 0.1,
  steps: 99,
  total: 9801
};

function main(log = false) {
  const start = Date.now();
  const { o1, o2, f1, f2 } = getVars();

  const list = [];
  for (let i = vars.min; i <= vars.smax; i += vars.step) {
    const list2 = [];
    for (let ii = vars.min; ii <= vars.max; ii += vars.step) {
      let p1 = (o1 * i) - i;
      if (!f2) p1 -= ii;
      let p2 = (o2 * ii) - ii;
      if (!f1) p2 -= i;
      list2.push({ s1: round(i), s2: round(ii), p: round(Math.min(p1, p2)) });
    }
    if (log) console.log(list2);
    list.push(getMax(list2));
  }
  if (log) console.log(list);
  const best = getMax(list);
  if (log) console.log(best);
  const end = Date.now();
  display(`s1: £${best.s1.toFixed(2)}, s2: £${best.s2.toFixed(2)}, p: £${best.p.toFixed(2)}, Time spent: ${humanify(start, end)}`);
}

function display(result) {
 getEl('result').innerHTML = result;
}

function getVars() {
  const o1 = parseFloat(getEl('o1').value);
  const o2 = parseFloat(getEl('o2').value);
  vars.min = parseFloat(getEl('min').value ?? vars.min);
  vars.max = parseFloat(getEl('max').value ?? vars.max);
  const f1 = Boolean(getEl('f1').checked ?? false);
  const f2 = Boolean(getEl('f2').checked ?? false);
  return { o1, o2, f1, f2 };
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
