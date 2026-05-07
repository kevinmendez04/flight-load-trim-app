/* ================================================
   FLIGHT LOAD & TRIM — CALCULATOR LOGIC
   ================================================ */

/* ── Aircraft data ── */
const aircraftData = {

    /* P2008JC */
    "VT-RIA": { weight: 432.45, arm: 1.843, type: "p2008jc" },
    "VT-RIB": { weight: 433.45, arm: 1.85,  type: "p2008jc" },
    "VT-RBD": { weight: 435.2,  arm: 1.856, type: "p2008jc" },
    "VT-RBI": { weight: 428.45, arm: 1.839, type: "p2008jc" },
    "VT-RBX": { weight: 416.45, arm: 1.89,  type: "p2008jc" },
    "VT-RBY": { weight: 420.95, arm: 1.893, type: "p2008jc" },
    "VT-RBR": { weight: 432.45, arm: 1.892, type: "p2008jc" },
    "VT-RFG": { weight: 431.45, arm: 1.892, type: "p2008jc" },
    "VT-RBS": { weight: 433.45, arm: 1.892, type: "p2008jc" },
    "VT-RBU": { weight: 431.45, arm: 1.892, type: "p2008jc" },
    "VT-RBJ": { weight: 427.45, arm: 1.84,  type: "p2008jc" },
    "VT-RBL": { weight: 426.95, arm: 1.84,  type: "p2008jc" },
    "VT-RFY": { weight: 432.7,  arm: 1.856, type: "p2008jc" },
    "VT-RFZ": { weight: 434.0,  arm: 1.857, type: "p2008jc" },
    "VT-RBV": { weight: 431.45, arm: 1.84,  type: "p2008jc" },
    "VT-RBW": { weight: 432.45, arm: 1.84,  type: "p2008jc" },
    "VT-RFE": { weight: 433.45, arm: 1.892, type: "p2008jc" },
    "VT-RFF": { weight: 431.45, arm: 1.892, type: "p2008jc" },

    /* P-Mentor */
    "VT-RFH": { weight: 453.45, arm: 1.738, type: "pmentor" },
    "VT-RFI": { weight: 454.45, arm: 1.726, type: "pmentor" },
    "VT-RFJ": { weight: 454.45, arm: 1.73,  type: "pmentor" },
    "VT-RFK": { weight: 460.45, arm: 1.74,  type: "pmentor" },
    "VT-RFL": { weight: 454.45, arm: 1.73,  type: "pmentor" },
    "VT-RFS": { weight: 458.4,  arm: 1.726, type: "pmentor" },
    "VT-RFO": { weight: 457.1,  arm: 1.725, type: "pmentor" },
    "VT-RFP": { weight: 459.5,  arm: 1.726, type: "pmentor" },
    "VT-RFR": { weight: 460.5,  arm: 1.723, type: "pmentor" },
    "VT-RFN": { weight: 456.4,  arm: 1.728, type: "pmentor" },

    /* Cessna */
    "VT-CAQ": { weight: 849.27, arm: 103.81, type: "cessna" },
    "VT-CAY": { weight: 837.5,  arm: 105.55, type: "cessna" },

    /* P2010 */
    "VT-RFT": { weight: 819.14, arm: 0.298, type: "p2010" },
    "VT-RFU": { weight: 816.17, arm: 0.289, type: "p2010" },

    /* P2006T */
    "VT-RIC": { weight: 881.74, arm: 0.409, type: "p2006t" },
    "VT-RBB": { weight: 859.3,  arm: 0.395, type: "p2006t" },
    "VT-RFW": { weight: 855.95, arm: 0.459, type: "p2006t" }
};

/* ── DOM references ── */
const elSelect      = document.getElementById('aircraft-select');
const elPilot       = document.getElementById('pilot-weight');
const elCopilot     = document.getElementById('copilot-weight');
const elFuel        = document.getElementById('fuel-weight');
const elLdgFuel     = document.getElementById('landing-fuel');
const elBaggage     = document.getElementById('baggage-weight');
const elLdgField    = document.getElementById('landing-fuel-field');
const elBagField    = document.getElementById('baggage-field');
const elFuelLbl     = document.getElementById('fuel-label-text');
const elCalcBtn     = document.getElementById('calculate-button');
const elAcLabel     = document.getElementById('ac-label');
const elError       = document.getElementById('error-msg');
const elEmpty       = document.getElementById('out-empty');
const elTblWrap     = document.getElementById('tbl-wrap');
const elTbody       = document.getElementById('results-body');
const elTfoot       = document.getElementById('results-foot');
const elCgBar       = document.getElementById('cg-bar');
const elContactBtn  = document.getElementById('contact-btn');
const elModal       = document.getElementById('contact-modal');
const elModalClose  = document.getElementById('modal-close');
const elCopyBtn     = document.getElementById('copy-btn');

/* ── Aircraft select: show/hide conditional fields ── */
elSelect.addEventListener('change', () => {
    const ac = aircraftData[elSelect.value];

    if (!ac) {
        elLdgField.style.display = 'none';
        elBagField.style.display = 'none';
        elFuelLbl.textContent    = 'FUEL';
        elAcLabel.textContent    = 'NO AIRCRAFT SELECTED';
        return;
    }

    const isP2010 = ac.type === 'p2010';
    elLdgField.style.display = isP2010 ? 'flex' : 'none';
    elBagField.style.display = isP2010 ? 'flex' : 'none';
    elFuelLbl.textContent    = isP2010 ? 'TAKE OFF FUEL' : 'FUEL';
    elAcLabel.textContent    = elSelect.value + ' · ' + ac.type.toUpperCase();
});

/* ── Calculate on button click or Enter key ── */
elCalcBtn.addEventListener('click', calculate);
document.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });

/* ── Contact modal ── */
elContactBtn.addEventListener('click', e => {
    e.preventDefault();
    elModal.classList.add('open');
});

elModalClose.addEventListener('click', () => elModal.classList.remove('open'));

elModal.addEventListener('click', e => {
    if (e.target === elModal) elModal.classList.remove('open');
});

elCopyBtn.addEventListener('click', function () {
    navigator.clipboard.writeText('captainkevinmendez@gmail.com').catch(() => {});
    this.textContent = 'COPIED';
    setTimeout(() => { this.textContent = 'COPY'; }, 1800);
});

/* ── Helpers ── */

function getVal(el) {
    const n = parseFloat(el.value);
    return isNaN(n) ? 0 : n;
}

function fmt(n, decimals) {
    return Number(n).toFixed(decimals);
}

function addRow(label, weight, arm, moment) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${label}</td>
        <td>${fmt(weight, 2)}</td>
        <td>${fmt(arm, 3)}</td>
        <td>${fmt(moment, 4)}</td>
    `;
    elTbody.appendChild(tr);
}

function addTotalRow(label, weight, momentLabel, moment) {
    const tr = document.createElement('tr');
    tr.className = 'tr-total';
    const momentCell = momentLabel
        ? `<td class="moment-green">${momentLabel}</td>`
        : `<td></td>`;
    tr.innerHTML = `
        <td>${label}</td>
        <td>${fmt(weight, 2)}</td>
        ${momentCell}
        <td>${fmt(moment, 4)}</td>
    `;
    elTfoot.appendChild(tr);
}

function addSecRow(label, weight, arm, moment) {
    const tr = document.createElement('tr');
    tr.className = 'tr-sec';
    const armCell = (arm !== '' && arm !== undefined)
        ? (isNaN(Number(arm)) ? `<td class="moment-green">${arm}</td>` : `<td>${fmt(arm, 3)}</td>`)
        : `<td></td>`;
    tr.innerHTML = `
        <td>${label}</td>
        <td>${fmt(weight, 2)}</td>
        ${armCell}
        <td>${fmt(moment, 4)}</td>
    `;
    elTfoot.appendChild(tr);
}

function showCG(value, unit) {
    elCgBar.style.display = 'flex';
    elCgBar.innerHTML = `
        <span class="cg-lbl">CENTER OF GRAVITY</span>
        <span class="cg-val">${fmt(value, 3)}<span class="cg-unit">${unit}</span></span>
    `;
}

function showDualCG(toCG, ldgCG) {
    elCgBar.style.display = 'flex';
    elCgBar.innerHTML = `
        <span class="cg-lbl">CENTER OF GRAVITY</span>
        <div class="cg-dual">
            <div class="cg-item">
                <span class="cg-num">${fmt(toCG, 3)} m</span>
                <span class="cg-sub">TAKEOFF</span>
            </div>
            <div class="cg-item">
                <span class="cg-num">${fmt(ldgCG, 3)} m</span>
                <span class="cg-sub">LANDING</span>
            </div>
        </div>
    `;
}

function clearResults() {
    elTbody.innerHTML       = '';
    elTfoot.innerHTML       = '';
    elCgBar.style.display   = 'none';
    elError.style.display   = 'none';
    elError.textContent     = '';
}

function showError(msg) {
    elError.textContent   = '⚠  ' + msg;
    elError.style.display = 'block';
}

function showTable() {
    elEmpty.style.display  = 'none';
    elTblWrap.style.display = 'block';
}

/* ── Main calculate function ── */
function calculate() {
    clearResults();

    const reg = elSelect.value;
    if (!reg || !aircraftData[reg]) {
        showError('Select a valid aircraft to continue.');
        return;
    }

    const ac = aircraftData[reg];
    showTable();

    switch (ac.type) {
        case 'p2008jc': handleP2008JC(ac); break;
        case 'pmentor':  handlePMentor(ac);  break;
        case 'cessna':   handleCessna(ac);   break;
        case 'p2010':    handleP2010(ac);    break;
        case 'p2006t':   handleP2006T(ac);   break;
        default: showError('Unsupported aircraft type.');
    }
}

/* ── Aircraft handlers ── */

function handleP2008JC(ac) {
    const pilot    = getVal(elPilot);
    const copilot  = getVal(elCopilot);
    const fuelL    = getVal(elFuel);

    const acMoment   = ac.weight * ac.arm;
    const fuelWeight = fuelL * 0.72;
    const fuelMoment = fuelWeight * 2.209;
    const pilotMom   = pilot * 1.8;
    const copilotMom = copilot * 1.8;

    const totalWeight = ac.weight + pilot + copilot + fuelWeight;
    const totalMoment = acMoment + pilotMom + copilotMom + fuelMoment;

    addRow('Aircraft', ac.weight, ac.arm,  acMoment);
    addRow('Pilot',    pilot,     1.8,     pilotMom);
    addRow('Copilot',  copilot,   1.8,     copilotMom);
    addRow('Fuel',     fuelWeight, 2.209,  fuelMoment);
    addTotalRow('Total', totalWeight, '', totalMoment);
    showCG(totalMoment / totalWeight, 'm');
}

function handlePMentor(ac) {
    const pilot    = getVal(elPilot);
    const copilot  = getVal(elCopilot);
    const fuelL    = getVal(elFuel);

    const acMoment   = ac.weight * ac.arm;
    const fuelWeight = fuelL * 0.72;
    const fuelMoment = fuelWeight * 2.139;
    const pilotMom   = pilot * 1.94;
    const copilotMom = copilot * 1.94;

    const totalWeight = ac.weight + pilot + copilot + fuelWeight;
    const totalMoment = acMoment + pilotMom + copilotMom + fuelMoment;

    addRow('Aircraft', ac.weight,  ac.arm, acMoment);
    addRow('Pilot',    pilot,      1.94,   pilotMom);
    addRow('Copilot',  copilot,    1.94,   copilotMom);
    addRow('Fuel',     fuelWeight, 2.139,  fuelMoment);
    addTotalRow('Total', totalWeight, '', totalMoment);
    showCG(totalMoment / totalWeight, 'm');
}

function handleCessna(ac) {
    const pilot    = getVal(elPilot);
    const copilot  = getVal(elCopilot);
    const fuelL    = getVal(elFuel);

    const acMoment   = ac.weight * ac.arm;
    const fuelWeight = fuelL * 0.84;
    const fuelMoment = fuelWeight * 121.92;
    const pilotMom   = pilot * 93.98;
    const copilotMom = copilot * 93.98;

    const totalWeight = ac.weight + pilot + copilot + fuelWeight;
    const totalMoment = acMoment + pilotMom + copilotMom + fuelMoment;

    /* Max AUW: subtract 1 kg and 121.92 moment */
    const maxAUW    = totalWeight - 1;
    const maxMoment = totalMoment - 121.92;

    addRow('Aircraft', ac.weight,  ac.arm,  acMoment);
    addRow('Pilot',    pilot,      93.98,   pilotMom);
    addRow('Copilot',  copilot,    93.98,   copilotMom);
    addRow('Fuel',     fuelWeight, 121.92,  fuelMoment);
    addTotalRow('Total',   totalWeight, '', totalMoment);
    addSecRow('Max AUW', maxAUW,      '', maxMoment);
    showCG(maxMoment / maxAUW, 'cm');
}

function handleP2010(ac) {
    const pilot     = getVal(elPilot);
    const copilot   = getVal(elCopilot);
    const toFuelL   = getVal(elFuel);
    const ldgFuelL  = getVal(elLdgFuel);
    const baggage   = elBaggage.value !== '' ? parseFloat(elBaggage.value) : 30;

    const acMoment   = ac.weight * ac.arm;
    const pilotMom   = pilot * 0.29;
    const copilotMom = copilot * 0.29;

    const dryWeight = ac.weight + pilot + copilot;
    const dryMoment = acMoment + pilotMom + copilotMom;
    const dryArm    = dryMoment / dryWeight;

    const toFuelWeight  = toFuelL * 0.8;
    const ldgFuelWeight = ldgFuelL * 0.8;
    const toFuelMoment  = toFuelWeight * 0.625;
    const ldgFuelMoment = ldgFuelWeight * 0.625;
    const baggageMoment = baggage * 1.612;

    const takeoffWeight = dryWeight + toFuelWeight + baggage;
    const landingWeight = dryWeight + ldgFuelWeight + baggage;
    const takeoffMoment = dryMoment + toFuelMoment + baggageMoment;
    const landingMoment = dryMoment + ldgFuelMoment + baggageMoment;
    const takeoffCG     = takeoffMoment / takeoffWeight;
    const landingCG     = landingMoment / landingWeight;

    addRow('Aircraft',   ac.weight,    ac.arm, acMoment);
    addRow('Pilot',      pilot,        0.29,   pilotMom);
    addRow('Copilot',    copilot,      0.29,   copilotMom);
    addRow('Dry weight', dryWeight,    dryArm, dryMoment);
    addRow('T/O fuel',   toFuelWeight, 0.625,  toFuelMoment);
    addRow('Ldg fuel',   ldgFuelWeight,0.625,  ldgFuelMoment);
    addRow('Baggage',    baggage,      1.612,  baggageMoment);

    addTotalRow('T/O AUW', takeoffWeight, 'T/O Moment', takeoffMoment);
    addSecRow('Ldg AUW',   landingWeight, 'Ldg Moment', landingMoment);
    showDualCG(takeoffCG, landingCG);
}

function handleP2006T(ac) {
    const pilot    = getVal(elPilot);
    const copilot  = getVal(elCopilot);
    const fuelL    = getVal(elFuel);

    const acMoment   = ac.weight * ac.arm;
    const fuelWeight = fuelL * 0.72;
    const fuelMoment = fuelWeight * 0.755;
    const pilotMom   = pilot * 0.893;
    const copilotMom = copilot * 0.893;

    const totalWeight = ac.weight + pilot + copilot + fuelWeight;
    const totalMoment = acMoment - pilotMom - copilotMom + fuelMoment;

    addRow('Aircraft', ac.weight,  ac.arm,  acMoment);
    addRow('Pilot',    pilot,      -0.893,  -pilotMom);
    addRow('Copilot',  copilot,    -0.893,  -copilotMom);
    addRow('Fuel',     fuelWeight,  0.755,   fuelMoment);
    addTotalRow('Total', totalWeight, '', totalMoment);
    showCG(totalMoment / totalWeight, 'm');
}
