
import { newRaceButtonVisibility } from "./new-race-button.js"
import { updateAddDriverButtonVisibility, noMoreDrivers } from "./circuit-section.js"
import { wait } from "./shared.js"


// Counter for the amount of drivers on screen
export let driverFormCount = 0;
export function changeFormCount(num) {
  if (num == 1) {
    driverFormCount++;
  } else if (num == -1) {
    driverFormCount = Math.max(0, driverFormCount - 1);
  }

  console.log("📢 Update: Form count:", driverFormCount);
}

// To reset the form counter
export function resetDriverFormCount() {
    driverFormCount = 0;
}

// To add a new driver
export async function addNewDriverForm() {
  const res = await fetch("/front-end/HTML/driver-form.html");
  const html = await res.text();

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

    driverLogic(driverForm);
    updateAddDriverButtonVisibility();

    console.log("📢 Update: A driver was successfully added.");
    changeFormCount(1);
}

// To check if a specific driver form has been completed
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

// Logic to be applied to each driver
async function driverLogic(driverForm) {
  const addButton = driverForm.querySelector(".add-driver-button");
  const deleteButton = driverForm.querySelector(".delete-driver-button");

  if (addButton) {
    addButton.addEventListener("click", () => {
      newRaceButtonVisibility();
      addNewDriverForm();
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      driverForm.classList.remove("show");
      driverForm.classList.add("removing");

      await wait(300);
      
      driverForm.remove();
      changeFormCount(-1);
      console.log("📢 Update: A driver has been deleted.");

      if (driverFormCount == 0){
        noMoreDrivers();
      }

      newRaceButtonVisibility();
      updateAddDriverButtonVisibility();
    });
  }

  const form = driverForm.querySelector("form");
  if (form) {
    form.addEventListener("input", () => {
      checkFormComplete(driverForm);
    });
  }
  
}
