// circuit-section.js

import { wait, driverFormCount, setCircuitSectionHTML, resetDriverFormCount } from "./shared.js";
import { addNewDriverForm } from "./driver-forms.js";
import { newRaceButtonVisibility } from "./new-race-button.js"

let hasAddedDrivers = false;

export async function addCircuitSection() {
    const res = await fetch("/front-end/HTML/circuit-section.html");
  const html = await res.text();

      setCircuitSectionHTML(html);

      const circuitContainer = document.getElementById("circuit-container");
      const temp = document.createElement("div");
      temp.innerHTML = html;

      const circuitSection = temp.querySelector(".circuit-section");
      if (!circuitSection) {
        console.log("⚠️ Error: circuit-section cannot be found.");
        return;
      }

      const deleteRaceButton = circuitSection.querySelector(".delete-race-section");
      if (deleteRaceButton) {
    deleteRaceButton.addEventListener("click", () => {
      console.log("Delete race button was clicked.");
          deleteRace(circuitSection);
        }) 
      }
await wait(200);
      circuitContainer.appendChild(circuitSection);

      requestAnimationFrame(() => {
        circuitSection.classList.remove("hidden");
        setTimeout(() => {
          circuitSection.classList.add("show");
        }, 20);
      });

      console.log("Circuit options are now visible.");
      setupCircuitSectionListeners(circuitSection);
    }

async function deleteRace(circuitSection) {
  const allDrivers = document.getElementById("all-drivers");
  const allIndividualDrivers = allDrivers.querySelectorAll(".driver-form");

  allDrivers.classList.add("hidden");
  await wait(300);

  allIndividualDrivers.forEach(driver => driver.remove());

 resetDriverFormCount();
  hasAddedDrivers = false;

  allDrivers.classList.remove("hidden");

  circuitSection.classList.add("hidden");
  await wait(200);
  circuitSection.remove();

  console.log("Race has been deleted.");
  newRaceButtonVisibility();
}

export function updateAddDriverButtonVisibility() {
        const circuitSection = document.querySelector(".circuit-section");
        if (!circuitSection) return;

        const addDriverButton = circuitSection.querySelector("#add-driver-circuit-section");
        if (!addDriverButton) return;

        if (driverFormCount == 0) {
            addDriverButton.classList.remove("hidden");
        } else {
            addDriverButton.classList.add("hidden");
        }
    }

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
      console.log("A circuit box was clicked.");

                    if (driverFormCount == 0 && !hasAddedDrivers) {
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
