
import { addNewRaceButton } from "./new-race-button.js"
import { noMoreDrivers } from "./circuit-section.js";
import { resetDriverFormCount } from "./driver-forms.js";
import { resetSubmitButtonState } from "./submit-race.js"

// Forces code to pause execution
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// To show error messages on screen in a toast pop-up
export async function showError(message) {
  const res = await fetch("/front-end/HTML/error-toast.html");
  const html = await res.text();

  const errorToastContainer = document.getElementById("error-toast-container");
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const errorToast = temp.querySelector(".toast");
  if (!errorToast) {
    console.log("⚠️ Error: error-toast cannot be found.");
    return;
  }

  if (message == null || message == ""){
    errorToast.querySelector(".error-message").textContent = "Something went wrong!";
  } else {
    errorToast.querySelector(".error-message").textContent = message;
  }

  errorToastContainer.appendChild(errorToast);

  errorToast.classList.remove("hidden");
  void errorToast.offsetWidth;

  requestAnimationFrame(async() => {
    errorToast.classList.add("show")
  });

  await wait(4000);

  errorToast.classList.remove("show");
  requestAnimationFrame(async() => {
    errorToast.classList.add("hidden")
  });

  await wait(400);

  errorToast.remove();
}

// To delete the whole race + bring back the New Race button
export async function deleteRace() {
  const circuitSection = document.querySelector(".circuit-section");
  const allDrivers = document.getElementById("all-drivers");
  const everyIndividualDriver = allDrivers.querySelectorAll(".driver-form");
  const submitButton = document.querySelector(".submit-race-button");

  if (submitButton != null) {
    submitButton.classList.add("hidden");

    await wait(200);

    submitButton.remove();
    resetSubmitButtonState();
  }

  allDrivers.classList.add("hidden");

  await wait(300);

  everyIndividualDriver.forEach(driver => driver.remove());

  resetDriverFormCount();
  noMoreDrivers();

  allDrivers.classList.remove("hidden");
  circuitSection.classList.add("hidden");

  await wait(200);

  circuitSection.remove();

  await wait(300);

  console.log("📢 Update: Current race has been fully removed.");

  addNewRaceButton();
}