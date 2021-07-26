require("@babel/polyfill");
import { startCase } from "lodash";
import Search from "./model/Search";
import { DOMelements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import * as listView from "./view/listView";
import { renderRecipe, clearRecipe, activeRecipe } from "./view/recipeView";
import Like from "./model/Like";
import * as likesView from "./view/likeView";

const foods = [
  "carrot",
  "broccoli",
  "asparagus",
  "cauliflower",
  "corn",
  "cucumber",
  "green pepper",
  "lettuce",
  "mushrooms",
  "onion",
  "potato",
  "pumpkin",
  "red pepper",
  "tomato",
  "beetroot",
  "brussel sprouts",
  "peas",
  "zucchini",
  "radish",
  "sweet potato",
  "artichoke",
  "leek",
  "cabbage",
  "celery",
  "chili",
  "garlic",
  "basil",
  "coriander",
  "parsley",
  "dill",
  "rosemary",
  "oregano",
  "cinnamon",
  "saffron",
  "green bean",
  "bean",
  "chickpea",
  "lentil",
  "apple",
  "apricot",
  "avocado",
  "banana",
  "blackberry",
  "blackcurrant",
  "blueberry",
  "boysenberry",
  "cherry",
  "coconut",
  "fig",
  "grape",
  "grapefruit",
  "kiwifruit",
  "lemon",
  "lime",
  "lychee",
  "mandarin",
  "mango",
  "melon",
  "nectarine",
  "orange",
  "papaya",
  "passion fruit",
  "peach",
  "pear",
  "pineapple",
  "plum",
  "pomegranate",
  "quince",
  "raspberry",
  "strawberry",
  "watermelon",
  "salad",
  "pizza",
  "pasta",
  "popcorn",
  "lobster",
  "steak",
  "bbq",
  "pudding",
  "hamburger",
  "pie",
  "cake",
  "sausage",
  "tacos",
  "kebab",
  "poutine",
  "seafood",
  "chips",
  "fries",
  "masala",
  "paella",
  "som tam",
  "chicken",
  "toast",
  "marzipan",
  "tofu",
  "ketchup",
  "hummus",
  "chili",
  "maple syrup",
  "parma ham",
  "fajitas",
  "champ",
  "lasagna",
  "poke",
  "chocolate",
  "croissant",
  "arepas",
  "bunny chow",
  "pierogi",
  "donuts",
  "rendang",
  "sushi",
  "ice cream",
  "duck",
  "curry",
  "beef",
  "goat",
  "lamb",
  "turkey",
  "pork",
  "fish",
  "crab",
  "bacon",
  "ham",
  "pepperoni",
  "salami",
  "ribs",
];

const state = {};

const controlSearch = async () => {
  //Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
  const query = searchView.getInput();

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
  controlSearch();
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

window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);
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
