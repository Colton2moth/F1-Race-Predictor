import { updateAddDriverButtonVisibility, noMoreDrivers } from "./circuit-section.js"
import { wait, showError } from "./shared.js"
import { submitButtonStatus, addSubmitRaceButton, updateSubmitButtonText } from "./submit-race.js"

// Counter for the amount of drivers on screen
export let driverFormCount = 0;
export function changeFormCount(num) {
  if (num == 1) {
    driverFormCount++
    driverFormCount = Math.min(20, driverFormCount);
  } else if (num == -1) {
    driverFormCount--;
    driverFormCount = Math.max(0, driverFormCount);
  }

  updateSubmitButtonText(driverFormCount);
  console.log("📢 Update: Form count:", driverFormCount);
}

// To reset the form counter
export function resetDriverFormCount() {
  driverFormCount = 0;
  updateSubmitButtonText(driverFormCount);
}

// To add a new driver
export async function addNewDriverForm() {
  if (driverFormCount >= 20) {
      let errorMsg = "ⓘ Alert: Driver limit has been hit, cannot add anymore drivers.";
      showError(errorMsg);

      console.log("ⓘ Alert: driver-form capacity has been reached, cannot add more than 20 driver-forms to one race");

      updateAddDriverButtonVisibility();
      return;
    }

  const res = await fetch("/front-end/HTML/driver-form.html");
  const html = await res.text();

  if (!html) {
    let errorMsg = "⚠️ Error: driverFormHTML cannot be found.";
    showError(errorMsg);

    console.log(errorMsg);
    return;
  }

  const allDrivers = document.getElementById("all-drivers");
  if (!allDrivers) {
    let errorMsg = "⚠️ Error: all-drivers container not found.";
    showError(errorMsg);
    
    console.log(errorMsg);
  return;
  }

  const temp = document.createElement("div");
  temp.innerHTML = html;

  const driverForm = temp.querySelector(".driver-form");
  if (!driverForm) {
    let errorMsg = "⚠️ Error: driver-form cannot be found.";
    showError(errorMsg);

    console.log(errorMsg);
    return;
  }

  allDrivers.appendChild(driverForm);

  requestAnimationFrame(() => {
      driverForm.classList.remove("hidden");
      driverForm.classList.add("show");
  });

  driverLogic(driverForm);
  changeFormCount(1);
  updateAddDriverButtonVisibility();

  console.log("📢 Update: A driver was successfully added.");
}

// To check if a specific driver form has been completed
function checkFormComplete(driverForm) {
  const driverSelect = driverForm.querySelector("select");
  const allInputs = driverForm.querySelectorAll("input[required]");

  const allInputsFilled = [...allInputs].every(input => input.value.trim() !== "");
  const driverValid = driverSelect && driverSelect.value !== "";

  if (allInputsFilled && driverValid) {
      driverForm.classList.add("completed");
  } else {
      driverForm.classList.remove("completed");
  }

  submitButtonStatus();
}

// Logic to be applied to each driver
async function driverLogic(driverForm) {
  const addButton = driverForm.querySelector(".add-driver-button");
  const deleteButton = driverForm.querySelector(".delete-driver-button");

  if (addButton) {
    

    addButton.addEventListener("click", () => {
      updateAddDriverButtonVisibility();
      addNewDriverForm();
      addSubmitRaceButton();
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

      updateAddDriverButtonVisibility();
    });
  }

  const form = driverForm.querySelector("form");
  if (form) {
    const inputs = form.querySelectorAll("input[required]");
    inputs.forEach(input => {
      input.addEventListener("input", () => checkFormComplete(driverForm));
    });

    const driverSelect = form.querySelector("select");
    if (driverSelect) {
      driverSelect.addEventListener("change", () => checkFormComplete(driverForm));
    }
  }

  checkFormComplete(driverForm);
}