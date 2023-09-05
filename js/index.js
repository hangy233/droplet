import Game from "./Game.js"

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  new Game().init(800, 20, 20);
});