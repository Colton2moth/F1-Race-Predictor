export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export let driverFormCount = 0;
export let driverFormHTML = "";
export let circuitSectionHTML = "";
export let circuitSectionVisable;

export function fetchDriverFormHTML() {
  return fetch("/front-end/html/driver-form.html")
    .then(res => res.text()); 
}

export function setcircuitSectionHTML(html) {
    circuitSectionHTML = html;
}

export function incrementFormCount() {
  driverFormCount++;
  console.log("Form count:", driverFormCount);
}

export function decrementFormCount() {
  driverFormCount = Math.max(0, driverFormCount - 1);
  console.log("Form count:", driverFormCount);
}

export function setDriverFormHTML(html) {
  driverFormHTML = html;
}

export function setCircuitSectionHTML(html) {
  circuitSectionHTML = html;
}