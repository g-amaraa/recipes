import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    let newItem = {
      id: uniqid(),
      item,
    };
    this.items.push(newItem);

    return newItem;
  }

  deleteItem(id) {
    const index = this.items.findIndex((el) => el.id === id);
    this.items.splice(index, 1);
  }
}
