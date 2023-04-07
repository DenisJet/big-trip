import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  constructor() {
    super();
    this._state = {};
  }

  updateData(update, jastDataUpdating) {
    if (!update) {
      return;
    }

    this._state = Object.assign({}, this._state, update);

    if (jastDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
