
document.addEventListener("DOMContentLoaded", () => {
    const submitRaceButton = document.querySelector(".submit-race-button");

    if (!submitRaceButton) {
        console.log("⚠️ Error: submit-race-button cannot be found.");
        return;
    }

    // For when the Submit Button is clicked
    submitRaceButton.addEventListener("click", async () => {
        console.log("📢 Update: Predict Podium button clicked.");

        const selectedCircuit = document.querySelector(".selected-circuit");
        if (!selectedCircuit) {
            console.log("⚠️ Error: No circuit selected.");
            return;
        }

        const circuit = selectedCircuit.dataset.value;

        const driverForms = document.querySelectorAll(".driver-form");

        if (!checkDrivers(driverForms)) {
            return;
        }

        const driverList = [];
        driverForms.forEach(driver => {
                const fp1 = parseFloat(driver.querySelector("input[name='fp1']").value);
                const fp2 = parseFloat(driver.querySelector("input[name='fp2']").value);
                const fp3 = parseFloat(driver.querySelector("input[name='fp3']").value);
                const quali = parseFloat(driver.querySelector("input[name='quali']").value);

                driverList.push({
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
                    
                } catch (err) {
                    console.error(err);
                    alert("Error sending prediction request.");
                }
            }
            });
});

function checkDrivers(driverForms) {
    for (const driver of driverForms) {
        if (!driver.classList.contains("completed")) {
            return false;
        }
    };

    return true;
}

export function submitButtonStatus() {
    const submitButton = document.querySelector(".submit-race-button");
    const driverForms = document.querySelectorAll(".driver-form");

    const allComplete = [...driverForms].every(form =>
        form.classList.contains("completed")
    );

    if (allComplete) {
        submitButton.classList.add("ready-to-submit");
        console.log("📢 Update: All driver forms have completed. Submit button is ready.");
    } else {
        submitButton.classList.remove("ready-to-submit");
        console.log("⚠️ Error: Not all driver forms have been completed.");
    }
}
