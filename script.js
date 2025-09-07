function main(log = false, logAll = false) {
  const start = Date.now();
  const {
    step,
    perP,
    min1,
    min2,
    max1,
    max2,
    l1,
    l2,
    o1,
    o2,
    f1,
    f2,
    c1,
    c2,
    c1ol,
    c2ol,
  } = getVars();
  const perPfn =
    perP && (f1 || f2)
      ? f1 && f2
        ? (i, ii) => (l1 ? unlay(i, o1) : i) + (l2 ? unlay(ii, o2) : ii)
        : f1
        ? (i, ii) => (l1 ? unlay(i, o1) : i)
        : (i, ii) => (l2 ? unlay(ii, o2) : ii)
      : (i, ii) => 1;
  const emin1 = l1 ? lay(min1, o1) : min1;
  const emax1 = l1 ? lay(max1, o1) : max1;
  const emin2 = l2 ? lay(min2, o2) : min2;
  const emax2 = l2 ? lay(max2, o2) : max2;

  if (log)
    console.log(
      JSON.stringify(
        {
          step,
          perP,
          min1,
          min2,
          emin1,
          emin2,
          max1,
          max2,
          emax1,
          emax2,
          l1,
          l2,
          o1,
          o2,
          f1,
          f2,
          c1,
          c2,
          c1ol,
          c2ol,
        },
        null,
        2
      )
    );

  const list = [];
  for (let i = emin1; i <= emax1; i += step) {
    const list2 = [];
    for (let ii = emin2; ii <= emax2; ii += step) {
      /* First */
      let p1 = l1 ? i : o1 * i - i;
      if (c1 > 0 && (p1 > 0 || c1ol)) p1 *= (100 - c1) / 100;
      if (!f2) p1 -= l2 ? unlay(ii, o2) : ii;

      /* Second */
      let p2 = l2 ? ii : o2 * ii - ii;
      if (c2 > 0 && (p2 > 0 || c2ol)) p2 *= (100 - c2) / 100;
      if (!f1) p2 -= l1 ? unlay(i, o1) : i;

      list2.push({
        s1: round(i),
        s2: round(ii),
        p: round(Math.min(p1, p2)),
        pp: round(Math.min(p1, p2) / perPfn(i, ii)),
        ...(logAll
          ? {
              p1,
              p2,
              c1,
              c1v: (100 - c1) / 100,
              c2,
              c2v: (100 - c2) / 100,
              sp1: l1 ? o1 : o1 * i - i,
              sp2: l2 ? o2 : o2 * ii - ii,
              f1: l1 ? unlay(i, o1) : o1,
              f2: l2 ? unlay(ii, o2) : o2,
            }
          : {}),
      });
    }
    if (logAll) console.log(list2);
    list.push(...getMax(list2));
  }
  if (logAll) console.log(list);
  const best = getMax(list);
  if (log) console.log(best);
  const strs = [];
  // best.forEach(({ s1, s2, p, pp }) =>
  //   strs.push(
  //     `s1: £${s1.toFixed(2)}, s2: £${s2.toFixed(2)}, p: £${p.toFixed(2)}, pp: £${pp.toFixed(2)}`
  //   )
  // );
  strs.push(
    `s1: £${best[0]?.s1.toFixed(2)}, s2: £${best[0]?.s2.toFixed(
      2
    )}, p: £${best[0]?.p.toFixed(2)}, pp: £${best[0]?.pp.toFixed(2)}`
  );
  const end = Date.now();
  strs.push(`Time spent: ${humanify(start, end)}`);
  display(strs);
}

/** @param {Array<string>} result */
function display(result) {
  const holder = getEl("p-holder");
  result.forEach((r) => {
    if (/[></]/.test(r)) return;
    const tag = document.createElement("p");
    tag.classList.add("result");
    tag.innerHTML = r;
    holder.appendChild(tag);
  });
}

function getVars() {
  return {
    step: parseFloat(getEl("step")?.value || 0.1),
    perP: Boolean(getEl("per-p")?.checked || false),
    min1: parseFloat(getEl("min1")?.value || 0.1),
    min2: parseFloat(getEl("min2")?.value || 0.1),
    max1: parseFloat(getEl("max1")?.value || 10),
    max2: parseFloat(getEl("max2")?.value || 10),
    l1: Boolean(getEl("l1")?.checked || false),
    l2: Boolean(getEl("l2")?.checked || false),
    o1: parseFloat(getEl("o1")?.value),
    o2: parseFloat(getEl("o2")?.value),
    f1: Boolean(getEl("f1")?.checked || false),
    f2: Boolean(getEl("f2")?.checked || false),
    c1: parseInt(getEl("c1")?.value || 0),
    c2: parseInt(getEl("c2")?.value || 0),
    c1ol: Boolean(getEl("c1.1")?.checked || false),
    c2ol: Boolean(getEl("c2.1")?.checked || false),
  };
}

/** @param {number} num @param {number | undefined} dp */
function round(num, dp = 2) {
  const by = Math.pow(10, dp);
  return Math.round(num * by) / by;
}

/** @param {Array<{ pp: number }>} list */
function getMax(list) {
  const flist = list.filter((v) => typeof v?.pp === "number");
  if (flist.length === 0) return [];
  if (flist.length === 1) return list.slice();
  function compare(maxs, next) {
    if (maxs[0].pp < next.pp) return [next];
    if (maxs[0].pp === next.pp) return maxs.concat(next);
    return maxs;
  }
  return flist.reduce(compare, [{ p: -Number.MAX_VALUE }]);
}

/** @param {number} d1 @param {number} d2 */
function humanify(d1, d2) {
  let time = d2 - d1;
  const mins = Math.floor(time / (60 * 1000));
  time -= mins * 60 * 1000;
  const secs = Math.floor(time / 1000);
  time -= secs * 1000;
  const ms = time;
  const list = [];
  if (mins > 0) list.push(mins + "m");
  if (secs > 0) list.push(secs + "s");
  if (ms > 0) list.push(ms + "ms");
  if (list.length === 0) return "instant";
  if (list.length === 1) return list[0];
  return list.slice(-1).join(", ") + " and " + list[list.length - 1];
}

/** @param {string} name */
function getEl(name) {
  return document.getElementById(name);
}

/** @param {number} s @param {number} o */
function lay(s, o) {
  return round(s / (o - 1));
}

/** @param {number} s @param {number} o */
function unlay(s, o) {
  return round(s * (o - 1));
}
