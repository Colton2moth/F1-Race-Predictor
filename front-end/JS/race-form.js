function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
        console.log("⚠️ Error: Main-content div cannot be found.")
        return;
    } else {
        console.log("Main-content div was found.")
    }
    
    const allDrivers = document.getElementById("all-drivers");
    const newRaceButtonContainer = document.getElementById("new-race-button-container");
    const circuitContainer = document.getElementById("circuit-container");

    let newRaceButtonHTML ="";
    let newRaceButton;

    let circuitSectionHTML ="";
    let circuitSectionVisable = false;

    let driverFormHTML = "";
    let driverFormCount = 0;

    fetch("/front-end/HTML/new-race-button.html")
        .then(res => res.text())
        .then(html => newRaceButtonHTML = html);

    fetch("/front-end/HTML/circuit-section.html")
        .then(res => res.text())
        .then(html => circuitSectionHTML = html);

    // Fetch the driver form once
    fetch("/front-end/HTML/driver-form.html")
        .then(res => res.text())
        .then(html => {
            driverFormHTML = html;

            addNewRaceButton();
            // Listener for NEW RACE button
            newRaceButton.addEventListener("click", async () => {
                await addCircuitSection();
            });

            // Global listener for add and delete buttons inside all form individually
            document.addEventListener("click", (event) => {
                const addButtonClicked = event.target.closest(".add-driver-button");
                const deleteButtonClicked = event.target.closest(".delete-driver-button");

                // Adding a new driver
                if (addButtonClicked) {
                    newRaceButtonVisibility();
                    addNewDriverForm();
                    return;
                }

                // Deleting a driver
                if (deleteButtonClicked) {
                    const formToRemove = deleteButtonClicked.closest(".driver-form");

                    if (formToRemove) {
                        formToRemove.classList.remove("show");
                        formToRemove.classList.add("removing");

                        // Wait for the animation to finish before removing the form
                        setTimeout(() => {
                            formToRemove.remove();
                            driverFormCount = Math.max(0, driverFormCount - 1);
                            console.log("Form count:", driverFormCount);
                            newRaceButtonVisibility();
                        }, 300);
                    }
                    return;
                }
            });
        });

    // Updates visibility of the NEW RACE button depending on the amount of forms on the screen
    function newRaceButtonVisibility() {
        if(circuitSectionVisable) {
            newRaceButton.classList.add("hidden");
            setTimeout(() => {
                newRaceButton.remove();
            }, 200);
        } else if (!circuitSectionVisable) {
            newRaceButton.classList.remove("hidden");
            newRaceButton.style.display = "flex";
        }
    }

    function addNewRaceButton() {
        if (!newRaceButtonHTML) {
            console.log("⚠️ Error: newRaceButtonHTML cannot be found.");
            return;
        }

        const temp = document.createElement("div");
        temp.innerHTML = newRaceButtonHTML;

        newRaceButton = temp.querySelector(".new-race-button");
            if (!newRaceButton) {
                console.log("⚠️ Error: new-race-button cannot be found.");   
                return;
            }
                    
        newRaceButtonContainer.appendChild(newRaceButton);

        console.log("New race button is now visable.");
    }

    // Adds in the circuit section
    async function addCircuitSection() {
        if (!circuitSectionHTML) {
            console.log("⚠️ Error: circuitSectionHTML cannot be found.");
            return;
        }

        // Fade out and remove the race button first
        newRaceButton.classList.add("hidden");
        await wait(200); // match CSS transition time
        newRaceButton.remove();

        // Now insert and animate the circuit section
        const temp = document.createElement("div");
        temp.innerHTML = circuitSectionHTML;

        const circuitSection = temp.querySelector(".circuit-section");
        if (!circuitSection) {
            console.log("⚠️ Error: circuit-section cannot be found.");
            return;
        }

        circuitContainer.appendChild(circuitSection);

        // Animate it in
        requestAnimationFrame(() => {
            circuitSection.classList.remove("hidden");
            circuitSectionVisable = true;
            setTimeout(() => {
                circuitSection.classList.add("show");
            }, 20); // short delay to trigger transition
        });

        console.log("Circuit options are now visible.");
        circuitSectionLogic(circuitSection);
}

    // Adds a new driver form
    function addNewDriverForm() {
        if (!driverFormHTML) {
            console.log("⚠️ Error: driverFormHTML cannot be found.");
            return;
        }

        const temp = document.createElement("div");
        temp.innerHTML = driverFormHTML;

        const driverForm = temp.querySelector(".driver-form");
            if (!driverForm) {
                console.log("⚠️ Error: driver-form cannot be found.");   
                return;
            }

        allDrivers.appendChild(driverForm);

        requestAnimationFrame(() => {
            driverForm.classList.remove("hidden");
            driverForm.classList.add("show");
        });

        driverFormCount++;
        console.log("Form count:", driverFormCount);

        driverLogic(driverForm);
        newRaceButtonVisibility();
    }

    // Applies logic for circuit section
    function circuitSectionLogic () {
        const circuitSection = document.querySelector(".circuit-section");
        const circuitBoxes = circuitSection.querySelectorAll(".circuit-box");
        const selectedCircuit = circuitSection.querySelector(".selected-circuit");
        const circuitValid = selectedCircuit !== null; 

        // When clicking a new circuit box...
        circuitBoxes.forEach(currentCircuitBox => {
            currentCircuitBox.addEventListener("click", () => {
                console.log("A circuit box was clicked.")

                if (driverFormCount == 0) {
                    addNewDriverForm();
                }

                // Unselect previously selected circuit
                const currentSelected = circuitSection.querySelector(".selected-circuit");
                if (currentSelected) {
                    currentSelected.classList.remove("selected-circuit");
                }

                // Make current circut the selected circuit
                currentCircuitBox.classList.add("selected-circuit");
                selectedCircuit.value = currentCircuitBox.dataset;

            });
        });
    }
 
    // Check if an individual driver form has been completed
    function checkFormComplete(driverForm) {
        const driverSelect = driverForm.querySelector("select");
        const inputs = driverForm.querySelectorAll("input[required]");

        const allInputsFilled = [...inputs].every(input => input.value.trim() !== "");
        const driverValid = driverSelect && driverSelect.value !== "";

        if (allInputsFilled && driverValid) {
            driverForm.classList.add("completed");
        } else {
            driverForm.classList.remove("completed");
        }
    }

    // Applies logic for each driver-form individually
    function driverLogic(singleDriver) {
        const form = singleDriver.querySelector("form");
        
        // Everytime the user clicks, check if this driver form has been completed
        document.addEventListener("click", () => {
            checkFormComplete(singleDriver);
        })

        //NEED TO REWRITE TO ALLOW SUBMITTING ALL FORMS AT ONCE AND TO OBTAINING 3 HIGHEST PODIUM ESTIMATES
        // When the user submits the form.. 
        /* form.addEventListener("submit", async function (e) {
            e.preventDefault();

            console.log("Race has been submitted");

            const circuit = document.querySelector(".selected-circuit")?.dataset.value;
            const fp1 = parseFloat(this.fp1.value);
            const fp2 = parseFloat(this.fp2.value);
            const fp3 = parseFloat(this.fp3.value);
            const quali = parseFloat(this.quali.value);

            const res = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ circuit, fp1, fp2, fp3, quali })
            });

            if (!res.ok) {
                resultBox.textContent = "⚠️ Error: See console for more details.";
                console.log("⚠️ Error: : Responce from backend is bugged.");
                return;
            } else {
                console.log("Responce from backend was obtained sucssesfully.");
            }

            const data = await res.json();
            resultBox.textContent = data.prediction === 1 ? "Will Podium 🏆" : "Will Not Podium ❌";
        });*/
    }
}); 
