import AbstractView from './abstract-view';
import { NavItems } from '../const';

const createSiteNavTemplate = () => `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-nav-item=${NavItems.TABLE}>${NavItems.TABLE}</a>
    <a class="trip-tabs__btn" href="#" data-nav-item=${NavItems.STATS}>${NavItems.STATS}</a>
  </nav>`;

export default class SiteNavView extends AbstractView {
  constructor() {
    super();

    this._navClickHandler = this._navClickHandler.bind(this);
    this._prevActivItem = NavItems.TABLE;
  }

  getTemplate() {
    return createSiteNavTemplate();
  }

  _navClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'A') {
      return;
    }

    if (evt.target.dataset.navItem === this._prevActivItem) {
      return;
    }

    this._callback.navClick(evt.target.dataset.navItem);
    this._prevActivItem = evt.target.dataset.navItem;
    this._setNavItem();
  }

  setNavClickHandler(callback) {
    this._callback.navClick = callback;
    this.getElement().addEventListener('click', this._navClickHandler);
  }

  _setNavItem() {
    const tableItem = this.getElement().querySelector(`[data-nav-item=${NavItems.TABLE}]`);
    const statsItem = this.getElement().querySelector(`[data-nav-item=${NavItems.STATS}]`);

    if (tableItem !== null && statsItem !== null) {
      tableItem.classList.toggle('trip-tabs__btn--active');
      statsItem.classList.toggle('trip-tabs__btn--active');
    }
  }
}
