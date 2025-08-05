import { wait } from "./shared.js";
import { addNewDriverForm, driverFormCount, resetDriverFormCount } from "./driver-forms.js";
import { addNewRaceButton } from "./new-race-button.js"

// To add the Circuit Section
export async function addCircuitSection() {
  const res = await fetch("/front-end/HTML/circuit-section.html");
  const html = await res.text();

  const circuitSectionContainer = document.getElementById("circuit-section-container");
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const circuitSection = temp.querySelector(".circuit-section");
  if (!circuitSection) {
    console.log("⚠️ Error: circuit-section cannot be found.");
    return;
  }

  const deleteRaceButton = circuitSection.querySelector(".delete-race-section");
   if (!deleteRaceButton) {
    console.log("⚠️ Error: delete-race-section cannot be found.");
    return;
  }

  deleteRaceButton.addEventListener("click", () => {
  console.log("📢 Update: Delete race button was clicked.");
  deleteRace(circuitSection);
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

// To track if at least one driver has been added
export let hasAddedDrivers = false;

export function noMoreDrivers() {
  hasAddedDrivers = false;
}

// To delete the whole race and bring back the New Race button
async function deleteRace(circuitSection) {
  const allDrivers = document.getElementById("all-drivers");
  const everyIndividualDriver = allDrivers.querySelectorAll(".driver-form");
  const submitButton = document.querySelector(".submit-race-button");

  if (submitButton != null) {
    submitButton.classList.add("hidden");

    await wait(200);

    submitButton.remove();
  }

  allDrivers.classList.add("hidden");

  await wait(300);

  everyIndividualDriver.forEach(driver => driver.remove());

  resetDriverFormCount();
  hasAddedDrivers = false;

  allDrivers.classList.remove("hidden");
  circuitSection.classList.add("hidden");

  await wait(200);

  circuitSection.remove();

  console.log("📢 Update: Current race has been fully deleted.");

  addNewRaceButton();
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
  
  circuitBoxes.forEach(currentCircuitBox => {
    currentCircuitBox.addEventListener("click", () => {
      console.log("📢 Update: A circuit box was clicked.");

      if (!hasAddedDrivers && driverFormCount == 0) {
      addNewDriverForm();
      hasAddedDrivers = true;
      }

      const currentSelected = circuitSection.querySelector(".selected-circuit");
      if (currentSelected) {
        currentSelected.classList.remove("selected-circuit");
      }

      currentCircuitBox.classList.add("selected-circuit");
    });
  });
}
