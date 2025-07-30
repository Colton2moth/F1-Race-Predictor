document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
        console.log("Error: Main-content div cannot be found.")
        return;
    } else {
        console.log("Main-content div was found.")
    }
    
    const allDrivers = document.getElementById("all-drivers");
    const newRaceButton = document.getElementById("new-race-button");

    let newDriverHTML = "";
    let driverFormCount = 0;

    // Fetch the form template once
    fetch("/front-end/HTML/driver-form.html")
        .then(res => res.text())
        .then(html => {
            newDriverHTML = html;

            // Listener for NEW RACE button
            newRaceButton.addEventListener("click", () => {
                addNewDriverForm();

                newRaceButtonVisibility();
            });

            // Global listener for add and delete buttons inside all form individually
            document.addEventListener("click", (event) => {
                const addButtonClicked = event.target.closest(".add-driver-button");
                const deleteButtonClicked = event.target.closest(".delete-driver-button");

                // Adding a new driver
                if (addButtonClicked) {
                    addNewDriverForm();

                    newRaceButtonVisibility();
                    return;
                }

                // Deleting a driver
                if (deleteButtonClicked) {
                    const formToRemove = deleteButtonClicked.closest(".driver-form");

                    if (formToRemove) {
                        formToRemove.remove();
                        
                        driverFormCount = Math.max(0, driverFormCount - 1);
                        console.log("Form count:", driverFormCount);
                        newRaceButtonVisibility();
                    }
                    return;
                }
            });
        });

    // Updates visibility of the NEW RACE button depending on the amount of forms on the screen
    function newRaceButtonVisibility() {
        newRaceButton.style.display = (driverFormCount === 0) ? "flex" : "none";
    }

    // Adds a new input form and initializes it
    function addNewDriverForm() {
        if (!newDriverHTML) {
            console.log("Error: newDriverHTML cannot be found.")
            return;
        }

        const temp = document.createElement("div");
        temp.innerHTML = newDriverHTML;

        const driverForm = temp.querySelector(".driver-form");
        if (!driverForm) {
            console.log("driver-form cannot be found.")   
            return;
        }

        driverForm.style.display = "block";
        allDrivers.appendChild(driverForm);

        driverFormCount++;
        console.log("Form count:", driverFormCount);

        driverLogic(driverForm);
        
        newRaceButtonVisibility();
    }

    // Applies logic for each driver-form individually
    function driverLogic(singleDriver) {
        const form = singleDriver.querySelector("form");
        const circuitBoxes = singleDriver.querySelectorAll(".circuit-box");
        const selectedCircuit = singleDriver.querySelector(".selected-circuit");
        
        // When clicking a new circuit box...
        circuitBoxes.forEach(currentCircuitBox => {
            currentCircuitBox.addEventListener("click", () => {
                // Unselect previously selected circuit
                const currentSelected = wrapper.querySelector(".selected-circuit");
                if (currentSelected) {
                    currentSelected.classList.remove("selected-circuit");
                }

                // Make current circut the selected circuit
                currentCircuitBox.classList.add("selected-circuit");
                selectedCircuit.value = currentCircuitBox.dataset.value;
            });
        });

        //NEED TO REWRITE TO ALLOW SUBMITTING ALL FORMS AT ONCE AND TO OBTAINING 3 HIGHEST PODIUM ESTIMATES
        // When the user submits the form.. 
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            console.log("Race has been submitted");

            const circuit = singleDriver.querySelector(".selected-circuit")?.dataset.value;
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
                resultBox.textContent = "Error: See console for more details.";
                console.log("Error: : Responce from backend is bugged.");
                return;
            } else {
                console.log("Responce from backend was obtained sucssesfully.");
            }

            const data = await res.json();
            resultBox.textContent = data.prediction === 1 ? "Will Podium 🏆" : "Will Not Podium ❌";
        });
    }
});
