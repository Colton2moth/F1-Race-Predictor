export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export let driverFormHTML = "";
export let circuitSectionHTML = "";
export let circuitSectionVisable;

export function setcircuitSectionHTML(html) {
    circuitSectionHTML = html;
}

export function setCircuitSectionHTML(html) {
  circuitSectionHTML = html;
}