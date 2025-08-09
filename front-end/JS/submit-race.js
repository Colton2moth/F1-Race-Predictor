import { wait, showError } from "./shared.js"
import { driverFormCount } from "./driver-forms.js"
import { showPodium } from "./show-podium.js";

// To check if the submit button has been added yet
let submitButtonAdded = false;
export function resetSubmitButtonState() {
  submitButtonAdded = false;
}

// To check if we have resived a responce from the ML model through app.py
export let resultsAreOut = false;

// To store the driver predictions when they come in
let driverPredictions = [];
export function setDriverPredictions(drivers) {
    driverPredictions.length = 0;           
    driverPredictions.push(...drivers);     
}

export function getDriverPredictions() {
    return driverPredictions;
}

// To store the value of the selected circuit for this race
let raceCircuit = null;
function setRaceCircuit(circuit) {
    raceCircuit = circuit;
}

export function getRaceCircuit() {
    return raceCircuit;
}

// To add the submit button
export async function addSubmitRaceButton() {
    if (submitButtonAdded) {
        return;
    }

    const res = await fetch("/front-end/HTML/submit-race-button.html");
    const html = await res.text();

    const predictButtonContainer = document.getElementById("predict-button-container");
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const submitRaceButton = temp.querySelector(".submit-race-button");
        if (!submitRaceButton) {
            let errorMsg = "⚠️ Error: submit-race-button cannot be found.";
            showError(errorMsg);

            console.log(errorMsg);
        return;
    } 
    
    predictButtonContainer.appendChild(submitRaceButton);
    submitButtonAdded = true;

    const observer = new MutationObserver(async() => {
        const circuitSelected = document.querySelector(".selected-circuit") !== null;

        if (circuitSelected && driverFormCount > 0) {
            await wait(300);
            
            submitRaceButton.classList.remove("hidden");

            await wait(200);

            submitRaceButton.classList.add("visible");
            console.log("📢 Update: Submit Race button is now visible.");
        } else {
            submitRaceButton.classList.add("hidden");
            submitRaceButton.classList.remove("visible");
        }

        if (driverFormCount >= 3) {
            submitRaceButton.classList.remove("add-more-drivers");
        } else {
            submitRaceButton.classList.add("add-more-drivers");
        }
    });

    const allDrivers = document.getElementById("all-drivers");
    observer.observe(allDrivers, { childList: true, subtree: true });

    // For when the Submit Button is clicked
    submitRaceButton.addEventListener("click", async () => {
        console.log("📢 Update: Predict Podium button clicked.");

        const selectedCircuit = document.querySelector(".selected-circuit");
        if (!selectedCircuit) {
            let errorMsg = "⚠️ Error: No circuit selected.";
            showError(errorMsg);
            
            console.log(errorMsg);
            return;
        }

        const circuit = selectedCircuit.dataset.value;
        setRaceCircuit(circuit);

        const driverForms = document.querySelectorAll(".driver-form");

        if (driverFormCount < 3) {
            let errorMsg = "🚨 Alert: At least 3 drivers are required to predict podium results.";
            showError(errorMsg);
            
            console.log("🚨 Alert: At least 3 driver-forms are required to predict podium results.");
            return;
        }

        if (!checkDrivers(driverForms)) {
            let errorMsg = "🚨 Alert: Not all driver forms have been completed.";
            showError(errorMsg);
            
            console.log("🚨 Alert: Not all driver-forms have been completed.");
            return;
        }

        const driverList = [];
        driverForms.forEach(driver => {
            const driverName = driver.querySelector("select").value;
            const fp1 = parseFloat(driver.querySelector("input[name='fp1']").value);
            const fp2 = parseFloat(driver.querySelector("input[name='fp2']").value);
            const fp3 = parseFloat(driver.querySelector("input[name='fp3']").value);
            const quali = parseFloat(driver.querySelector("input[name='quali']").value);

            driverList.push({
                driverName,
                circuit,
                fp1,
                fp2,
                fp3,
                quali
            });
        });

        if (submitRaceButton.classList.contains("ready-to-submit")) {
            try {
                const res = await fetch("http://127.0.0.1:5000/predict", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ drivers: driverList })
                });

                console.log("📢 Update: Race has succsessfully been sent in for prediction.");

                const result = await res.json();

                if (result.error) {
                    console.error(result.error);
                    alert("Prediction failed.");
                    return;
                }

                console.log(result);
                setDriverPredictions(result.predictions);
                resultsAreOut = true;
            } catch (err) {
                console.error(err);
                alert("Error sending prediction request.");
            }
        }

    showPodium();
    });
}

// To change the text on the Submit Race button depending on the state of the driver-forms
export function updateSubmitButtonText(driverCount) {
    const textElement = document.querySelector(".submit-race-button-text");
    if (!textElement) return;

    const icon = document.querySelector(".submit-race-button .material-symbols-rounded");
    if (driverCount < 3) {
        textElement.textContent = `Add ${3 - driverCount} more driver(s)`;
        icon.classList.add("icon-disabled");
    } else {
        textElement.textContent = "Predict Podium";
        icon.classList.remove("icon-disabled");
    }
}

// To check if all the driver-forms have been completed
function checkDrivers(driverForms) {
    for (const driver of driverForms) {
        if (!driver.classList.contains("completed")) {
            return false;
        }
    };

    return true;
}

// To update the styles and animations of the Submit Race button depending on the completion status of the driver-forms
export async function submitButtonStatus() {
    const submitRaceButton = document.querySelector(".submit-race-button");
    if (!submitRaceButton) {
        let errorMsg = "⚠️ Error: submit-race-button cannot be found.";
        showError(errorMsg);
            
        console.log();
        return;
    }

    const driverForms = document.querySelectorAll(".driver-form");

    const allComplete = [...driverForms].every(form =>
        form.classList.contains("completed")
    );

    if (driverFormCount >= 3 && allComplete) {
        submitRaceButton.classList.remove("not-ready");

        await wait(200);

        submitRaceButton.classList.add("ready-to-submit");
        console.log("📢 Update: All driver forms have completed. Submit button is ready.");
    } else {
        submitRaceButton.classList.add("not-ready");

        await wait(200);

        submitRaceButton.classList.remove("ready-to-submit");
    }
}
