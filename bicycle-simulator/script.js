document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const FRONT_GEAR_COUNT = 2;
    const REAR_GEAR_COUNT = 11;

    // --- State ---
    let currentFrontGear = 1;
    let currentRearGear = 1;
    let shiftInterval = null;
    let shiftedInSessionCount = 0;

    // --- DOM Elements ---
    const frontGearDisplay = document.getElementById('front-gear-display');
    const rearGearDisplay = document.getElementById('rear-gear-display');
    const frontGearsVisual = document.getElementById('front-gears-visual');
    const rearGearsVisual = document.getElementById('rear-gears-visual');
    const frontUpButton = document.getElementById('front-up-button');
    const frontDownButton = document.getElementById('front-down-button');
    const rearUpButton = document.getElementById('rear-up-button');
    const rearDownButton = document.getElementById('rear-down-button');
    
    const continuousShiftToggle = document.getElementById('continuous-shift-toggle');
    const maxShiftSetting = document.getElementById('max-shift-setting');
    const maxShiftInput = document.getElementById('max-shift-input');

    // --- Functions ---

    function createVisualGears() {
        frontGearsVisual.innerHTML = '';
        for (let i = 1; i <= FRONT_GEAR_COUNT; i++) {
            const cog = document.createElement('div');
            cog.className = 'gear-cog';
            cog.dataset.gear = i;
            cog.style.width = `${30 + i * 10}px`;
            cog.style.height = `${30 + i * 10}px`;
            frontGearsVisual.appendChild(cog);
        }

        rearGearsVisual.innerHTML = '';
        for (let i = 1; i <= REAR_GEAR_COUNT; i++) {
            const cog = document.createElement('div');
            cog.className = 'gear-cog';
            cog.dataset.gear = i;
            cog.style.width = `${45 - i * 2}px`;
            cog.style.height = `${45 - i * 2}px`;
            rearGearsVisual.appendChild(cog);
        }
    }

    function updateDisplay() {
        frontGearDisplay.textContent = currentFrontGear;
        rearGearDisplay.textContent = currentRearGear;

        document.querySelectorAll('#front-gears-visual .gear-cog').forEach(cog => {
            cog.classList.toggle('active', parseInt(cog.dataset.gear) === currentFrontGear);
        });

        document.querySelectorAll('#rear-gears-visual .gear-cog').forEach(cog => {
            cog.classList.toggle('active', parseInt(cog.dataset.gear) === currentRearGear);
        });
        
        frontUpButton.disabled = currentFrontGear >= FRONT_GEAR_COUNT;
        frontDownButton.disabled = currentFrontGear <= 1;
        rearUpButton.disabled = currentRearGear >= REAR_GEAR_COUNT;
        rearDownButton.disabled = currentRearGear <= 1;
    }

    const stopShifting = () => {
        clearInterval(shiftInterval);
        shiftInterval = null;
    };

    const shiftActions = {
        frontUp: () => {
            if (currentFrontGear < FRONT_GEAR_COUNT) {
                currentFrontGear++;
                shiftedInSessionCount++;
                updateDisplay();
            } else {
                stopShifting();
            }
        },
        frontDown: () => {
            if (currentFrontGear > 1) {
                currentFrontGear--;
                shiftedInSessionCount++;
                updateDisplay();
            } else {
                stopShifting();
            }
        },
        rearUp: () => {
            if (currentRearGear < REAR_GEAR_COUNT) {
                currentRearGear++;
                shiftedInSessionCount++;
                updateDisplay();
            } else {
                stopShifting();
            }
        },
        rearDown: () => {
            if (currentRearGear > 1) {
                currentRearGear--;
                shiftedInSessionCount++;
                updateDisplay();
            } else {
                stopShifting();
            }
        }
    };

    const startShifting = (action) => {
        stopShifting();
        shiftedInSessionCount = 0;

        const isContinuous = continuousShiftToggle.checked;
        
        if (isContinuous) {
            const maxShifts = parseInt(maxShiftInput.value, 10) || REAR_GEAR_COUNT;
            const continuousAction = () => {
                if (shiftedInSessionCount >= maxShifts) {
                    stopShifting();
                    return;
                }
                action();
            };
            continuousAction();
            shiftInterval = setInterval(continuousAction, 500);
        } else {
            action();
        }
    };

    const handleToggleChange = () => {
        maxShiftSetting.classList.toggle('hidden', !continuousShiftToggle.checked);
        stopShifting();
    };

    // --- Event Listeners ---
    frontUpButton.addEventListener('mousedown', () => startShifting(shiftActions.frontUp));
    frontDownButton.addEventListener('mousedown', () => startShifting(shiftActions.frontDown));
    rearUpButton.addEventListener('mousedown', () => startShifting(shiftActions.rearUp));
    rearDownButton.addEventListener('mousedown', () => startShifting(shiftActions.rearDown));

    [frontUpButton, frontDownButton, rearUpButton, rearDownButton].forEach(button => {
        button.addEventListener('mouseup', stopShifting);
        button.addEventListener('mouseleave', stopShifting);
    });

    continuousShiftToggle.addEventListener('change', handleToggleChange);

    // --- Initialization ---
    createVisualGears();
    updateDisplay();
    handleToggleChange();
});