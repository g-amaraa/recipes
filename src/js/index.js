import Search from "./model/Search";
import { DOMelements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import * as listView from "./view/listView";
import { renderRecipe, clearRecipe, activeRecipe } from "./view/recipeView";
import Like from "./model/Like";
import * as likesView from "./view/likeView";
import * as foodsView from "./view/foodsView";

const state = {};
foodsView.renderFoodMenu();

const controlSearch = async (query) => {
  //Вэбээс хайлтын түлхүүр үгийг гаргаж авна.

  if (query) {
    // шинээр хайлтын обьектыг үүсгэнэ
    state.search = new Search(query);

    // хайлт хийхэд зориулж дэлгэцийн хэрэглэгчийн интерфэйсийг бэлдэнэ.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(DOMelements.searchResultDiv);

    // хайлтыг гүйцэтгэнэ
    await state.search.doSearch();

    //хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
    clearLoader();

    if (state.search.result == undefined) {
      DOMelements.searchInput.value = "";
      DOMelements.searchInput.placeholder = "Хайлт илэрцгүй.";
    } else searchView.renderRecipes(state.search.result);
  }
};

DOMelements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchByWord = searchView.getInput();
  controlSearch(searchByWord);
});

document.querySelector(".foodMenu").addEventListener("click", (e) => {
  e.preventDefault();
  let searchByButton = e.target.closest(".food-menu-button").id;
  if (searchByButton.includes("-"))
    searchByButton = searchByButton.replace("-", " ");
  controlSearch(searchByButton);
});

DOMelements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goto = parseInt(btn.dataset.goto);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, goto);
  }
});

const controlRecipe = async () => {
  // URL-ээс ID-г салгаж авна
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Жорын моделийг үүсгэж өгнө
    state.recipe = new Recipe(id);

    // UI дэлгэцийг бэлтгэнэ
    clearRecipe();
    renderLoader(DOMelements.recipeDiv);
    activeRecipe(id);

    // Жороо татаж авчирна
    await state.recipe.getRecipe();

    // Жороо дэлгэцэнд гаргана.
    clearLoader();
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);
window.addEventListener("load", () => {
  if (!state.likes) state.likes = new Like();
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  state.likes.likes.forEach((l) => {
    likesView.renderLikes(l);
  });
});

const controlList = () => {
  state.list = new List();
  state.recipe.ingredients.forEach((n) => {
    const item = state.list.addItem(n);
    listView.renderItem(item);
  });
};

const controlLike = () => {
  if (!state.likes) state.likes = new Like();
  const currentRecipe = state.recipe.id;
  if (state.likes.isLiked(currentRecipe)) {
    state.likes.deleteLike(currentRecipe);
    likesView.deleteLike(currentRecipe);
    likesView.toggleLikeBtn(false);
  } else {
    const newLike = state.likes.addLike(
      currentRecipe,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    likesView.renderLikes(newLike);
    likesView.toggleLikeBtn(true);
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

DOMelements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    listView.clearItems();
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

DOMelements.shoppingList.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (
    e.target.parentElement.parentElement.parentElement.dataset.itemid == id ||
    e.target.parentElement.parentElement.dataset.itemid == id
  ) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  }
});
