import { DOMelements } from "./base";
const renderRecipe = (recipe) => {
  let markup = `
  <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${recipe.title}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
  DOMelements.searchResultList.insertAdjacentHTML("beforeend", markup);
};

export const clearSearchQuery = () => {
  DOMelements.searchInput.value = "";
};

export const clearSearchResult = () => {
  DOMelements.searchResultList.innerHTML = "";
  DOMelements.pageButtons.innerHTML = "";
};

export const getInput = () => DOMelements.searchInput.value;

const createButton = (page, type, direction) => `
<button class="btn-inline results__btn--${type}" data-goto="${page}">
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${direction}"></use>
</svg>
<span>Хуудас ${page}</span>
</button>`;

const renderButtons = (currentPage, totalPages) => {
  let buttonHTML;
  if (totalPages == 1) {
  } else if (currentPage == 1 && totalPages > 1) {
    buttonHTML = createButton(currentPage + 1, "next", "right");
  } else if (currentPage == totalPages) {
    buttonHTML = createButton(currentPage - 1, "prev", "left");
  } else {
    buttonHTML = createButton(currentPage - 1, "prev", "left");
    buttonHTML += createButton(currentPage + 1, "next", "right");
  }

  DOMelements.pageButtons.insertAdjacentHTML("afterbegin", buttonHTML);
};

export const renderRecipes = (recipe, currentPage = 1, resPerPage = 12) => {
  const pageStart = (currentPage - 1) * resPerPage;
  const pageEnd = currentPage * resPerPage;
  recipe.slice(pageStart, pageEnd).forEach(renderRecipe);

  const totalPages = Math.ceil(recipe.length / resPerPage);
  renderButtons(currentPage, totalPages);
};
