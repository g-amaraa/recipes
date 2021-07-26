export default class Like {
  constructor() {
    this.readLocalStorage();
    if (!this.likes) this.likes = [];
  }
  addLike(id, title, publisher, img) {
    const like = { id, title, publisher, img };
    this.likes.push(like);
    this.saveDataToLocalStorage();
    return like;
  }
  deleteLike(id) {
    const index = this.likes.findIndex((el) => (el.id = id));
    this.likes.splice(index, 1);
    this.saveDataToLocalStorage();
  }

  isLiked(id) {
    return this.likes.findIndex((el) => el.id == id) !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  saveDataToLocalStorage() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readLocalStorage() {
    this.likes = JSON.parse(localStorage.getItem("likes"));
  }
}
