import { DOMelements } from "./base";

export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
  document
    .querySelector(".recipe__love use")
    .setAttribute("href", `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = (numberOfLikes) => {
  DOMelements.likesMenu.style.visibility =
    numberOfLikes > 0 ? "visible" : "hidden";
};

export const renderLikes = (newLike) => {
  const ll_html = `<li>
  <a class="likes__link" href="#${newLike.id}">
      <figure class="likes__fig">
          <img src="${newLike.img}" alt="Test">
      </figure>
      <div class="likes__data">
          <h4 class="likes__name">${newLike.title}</h4>
          <p class="likes__author">${newLike.publisher}</p>
      </div>
  </a>
</li>`;
  DOMelements.likesList.insertAdjacentHTML("beforeend", ll_html);
};

export const deleteLike = (id) => {
  const element = document.querySelector(
    `.likes__link[href*="${id}"]`
  ).parentElement;
  if (element) element.parentElement.removeChild(element);
};
