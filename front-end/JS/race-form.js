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

    let hasAddedDrivers = false;

    let newRaceButtonHTML = "";
    let newRaceButton;

    let circuitSectionHTML = "";
    let circuitSectionVisable = false;

    let driverFormHTML = "";
    let driverFormCount = 0;

    fetch("/front-end/HTML/new-race-button.html")
        .then(res => res.text())
        .then(html => newRaceButtonHTML = html);

    fetch("/front-end/HTML/circuit-section.html")
        .then(res => res.text())
        .then(html => circuitSectionHTML = html);

    fetch("/front-end/HTML/driver-form.html")
        .then(res => res.text())
        .then(html => {
            driverFormHTML = html;

            addNewRaceButton();

            newRaceButton.addEventListener("click", async () => {
                await addCircuitSection();
            });

            document.addEventListener("click", (event) => {
                const addButtonClicked = event.target.closest(".add-driver-button");
                const deleteButtonClicked = event.target.closest(".delete-driver-button");

                if (addButtonClicked) {
                    newRaceButtonVisibility();
                    addNewDriverForm();
                    return;
                }

                if (deleteButtonClicked) {
                    const formToRemove = deleteButtonClicked.closest(".driver-form");

                    if (formToRemove) {
                        formToRemove.classList.remove("show");
                        formToRemove.classList.add("removing");

                        setTimeout(() => {
                            formToRemove.remove();
                            driverFormCount = Math.max(0, driverFormCount - 1);
                            console.log("Form count:", driverFormCount);
                            newRaceButtonVisibility();
                            updateAddDriverButtonVisibility(); // 🟢 NEW
                        }, 300);
                    }
                    return;
                }
            });
        });

    function newRaceButtonVisibility() {
        if (circuitSectionVisable) {
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

    async function addCircuitSection() {
        if (!circuitSectionHTML) {
            console.log("⚠️ Error: circuitSectionHTML cannot be found.");
            return;
        }

        newRaceButton.classList.add("hidden");
        await wait(200);
        newRaceButton.remove();

        const temp = document.createElement("div");
        temp.innerHTML = circuitSectionHTML;

        const circuitSection = temp.querySelector(".circuit-section");
        if (!circuitSection) {
            console.log("⚠️ Error: circuit-section cannot be found.");
            return;
        }

        circuitContainer.appendChild(circuitSection);

        requestAnimationFrame(() => {
            circuitSection.classList.remove("hidden");
            circuitSectionVisable = true;
            setTimeout(() => {
                circuitSection.classList.add("show");
            }, 20);
        });

        console.log("Circuit options are now visible.");
        circuitSectionLogic(circuitSection);
    }

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

        const circuitSection = document.querySelector(".circuit-section");
        const addDriverButton = circuitSection?.querySelector("#add-driver-circuit-section");
        if (addDriverButton)
            addDriverButton.classList.add("hidden");

        driverLogic(driverForm);
        newRaceButtonVisibility();
        updateAddDriverButtonVisibility(); // 🟢 NEW
    }

    function circuitSectionLogic() {
        const circuitSection = document.querySelector(".circuit-section");
        const addDriverButton = circuitSection.querySelector("#add-driver-circuit-section");
        const circuitBoxes = circuitSection.querySelectorAll(".circuit-box");
        const selectedCircuit = circuitSection.querySelector(".selected-circuit");
        const circuitValid = selectedCircuit !== null; 

        if (!hasAddedDrivers && circuitValid) {
            addDriverButton.classList.remove("hidden");
        }

        addDriverButton.addEventListener("click", () => {
            
        });

        circuitBoxes.forEach(currentCircuitBox => {
            currentCircuitBox.addEventListener("click", () => {
                console.log("A circuit box was clicked.");

                if (driverFormCount === 0 && addDriverButton.classList.contains("hidden")) {
                    addNewDriverForm();
                    hasAddedDrivers = true;
                }
                
                const currentSelected = circuitSection.querySelector(".selected-circuit");
                if (currentSelected) {
                    currentSelected.classList.remove("selected-circuit");
                }

                currentCircuitBox.classList.add("selected-circuit");
                selectedCircuit.value = currentCircuitBox.dataset;
            });
        });
    }

    function updateAddDriverButtonVisibility() { // 🟢 NEW FUNCTION
        const circuitSection = document.querySelector(".circuit-section");
        if (!circuitSection) return;

        const addDriverButton = circuitSection.querySelector("#add-driver-circuit-section");
        if (!addDriverButton) return;

        if (driverFormCount === 0) {
            addDriverButton.classList.remove("hidden");
        } else {
            addDriverButton.classList.add("hidden");
        }
    }

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

    function driverLogic(singleDriver) {
        const form = singleDriver.querySelector("form");

        document.addEventListener("click", () => {
            checkFormComplete(singleDriver);
        });
    }
});
