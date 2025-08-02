import { driverFormCount, incrementFormCount, decrementFormCount, fetchDriverFormHTML} from "./shared.js";
import { newRaceButtonVisibility } from "./new-race-button.js"
import { updateAddDriverButtonVisibility } from "./circuit-section.js"

export function addNewDriverForm() {

    fetchDriverFormHTML()
        .then(html => {

        if (!html) {
            console.log("⚠️ Error: driverFormHTML cannot be found.");
            return;
        }

        const allDrivers = document.getElementById("all-drivers");
        if (!allDrivers) {
        console.log("⚠️ Error: all-drivers container not found.");
        return;
        }

        const temp = document.createElement("div");
        temp.innerHTML = html;

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

        incrementFormCount();
        driverLogic(driverForm);
        updateAddDriverButtonVisibility();
    })


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

    function driverLogic(driverForm) {
  const addButton = driverForm.querySelector(".add-driver-button");
  const deleteButton = driverForm.querySelector(".delete-driver-button");

  if (addButton) {
    addButton.addEventListener("click", () => {
      newRaceButtonVisibility();
      addNewDriverForm();
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      driverForm.classList.remove("show");
      driverForm.classList.add("removing");

      setTimeout(() => {
        driverForm.remove();
        decrementFormCount();
        newRaceButtonVisibility();
        updateAddDriverButtonVisibility();
      }, 300);
    });
  }

  // Optional: also attach completion check logic
  const form = driverForm.querySelector("form");
  if (form) {
    form.addEventListener("input", () => {
      checkFormComplete(driverForm);
    });
  }
}
