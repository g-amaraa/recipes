import { foods } from "./base";

export const renderFoodMenu = () => {
  foods.forEach((e) => {
    let elementId;
    e.includes(" ") ? (elementId = e.replace(" ", "-")) : (elementId = e);
    document
      .querySelector(".foodMenu")
      .insertAdjacentHTML(
        "beforeend",
        `<button class="btn-small food-menu-button" id=${elementId}>${e}</button>`
      );
  });
};
