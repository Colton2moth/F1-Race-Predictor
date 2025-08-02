// circuit-section.js

import { wait, driverFormCount, setCircuitSectionHTML } from "./shared.js";
import { addNewDriverForm } from "./driver-forms.js";

let hasAddedDrivers = false;

export function addCircuitSection() {
  fetch("/front-end/HTML/circuit-section.html")
    .then(res => res.text())
    .then(html => {
      setCircuitSectionHTML(html);

      const circuitContainer = document.getElementById("circuit-container");
      const temp = document.createElement("div");
      temp.innerHTML = html;

      const circuitSection = temp.querySelector(".circuit-section");
      if (!circuitSection) {
        console.log("⚠️ Error: circuit-section cannot be found.");
        return;
      }

      circuitContainer.appendChild(circuitSection);

      requestAnimationFrame(() => {
        circuitSection.classList.remove("hidden");
        setTimeout(() => {
          circuitSection.classList.add("show");
        }, 20);
      });

      console.log("Circuit options are now visible.");
      setupCircuitSectionListeners(circuitSection);
    });
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

                    if (driverFormCount == 0 && addDriverButton.classList.contains("hidden")) {
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
