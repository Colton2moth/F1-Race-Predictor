import { wait, deleteRace, showError } from "./shared.js";
import { addNewDriverForm, driverFormCount } from "./driver-forms.js";
import { addSubmitRaceButton } from "./submit-race.js"

// To track if at least one driver has been added
export let hasAddedDrivers = false;
export function noMoreDrivers() {
  hasAddedDrivers = false;
}

// To add the Circuit Section
export async function addCircuitSection() {
  const res = await fetch("/front-end/HTML/circuit-section.html");
  const html = await res.text();

  const circuitSectionContainer = document.getElementById("circuit-section-container");
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const circuitSection = temp.querySelector(".circuit-section");
  if (!circuitSection) {
    let errorMsg = "⚠️ Error: circuit-section cannot be found.";
    showError(errorMsg);

    console.log(errorMsg);
    return;
  }

  const deleteRaceButton = circuitSection.querySelector(".delete-race-section");
   if (!deleteRaceButton) {
    let errorMsg = "⚠️ Error: delete-race-section cannot be found.";
    showError(errorMsg);

    console.log(errorMsg);
    return;
  }

  deleteRaceButton.addEventListener("click", () => {
  console.log("📢 Update: Delete race button was clicked.");
  deleteRace();
  }) 

  await wait(200);

  if (!circuitSection.classList.contains("hidden")) {
    circuitSection.classList.add("hidden");
  }

  circuitSectionContainer.appendChild(circuitSection);

  void circuitSection.offsetHeight;
  circuitSection.classList.remove("hidden");
  circuitSection.classList.add("show");

  await wait(200);

  setupCircuitSectionListeners(circuitSection);
  console.log("📢 Update: Circuit section is now visible.");
}

// To update the visibility of the Add Driver button in the Circuit Section
export function updateAddDriverButtonVisibility() {
  const circuitSection = document.querySelector(".circuit-section");
  if (!circuitSection) return;

  const addDriverButton = circuitSection.querySelector("#add-driver-circuit-section");
  if (!addDriverButton) return;

  if (!hasAddedDrivers) {
    addDriverButton.classList.remove("hidden");
  } else {
    addDriverButton.classList.add("hidden");
  }
}

// To set up the logic for the Circuit Section
function setupCircuitSectionListeners(circuitSection) {
  const addDriverButton = circuitSection.querySelector("#add-driver-circuit-section");
  const circuitBoxes = circuitSection.querySelectorAll(".circuit-box");
  const selectedCircuit = circuitSection.querySelector(".selected-circuit");
  const circuitValid = selectedCircuit !== null;

  if (!hasAddedDrivers && circuitValid) {
    addDriverButton.classList.remove("hidden");
  }

  addDriverButton.addEventListener("click", () => {
    addNewDriverForm();
    hasAddedDrivers = true;
  });

  // Logic for each individual circuit selection box
  circuitBoxes.forEach(currentCircuitBox => {
    currentCircuitBox.addEventListener("click", () => {
      console.log("📢 Update: A circuit box was clicked.");

      if (!hasAddedDrivers && driverFormCount == 0) {
        addNewDriverForm();
        hasAddedDrivers = true;
        addSubmitRaceButton();
      }

      const currentSelected = circuitSection.querySelector(".selected-circuit");
      if (currentSelected) {
        currentSelected.classList.remove("selected-circuit");
      }

      currentCircuitBox.classList.add("selected-circuit");
    });
  });
}
