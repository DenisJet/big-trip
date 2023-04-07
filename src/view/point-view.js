import AbstractView from './abstract-view';
import { getTimeDuration, humanizeDate } from '../utils/point-utils';

const createPointOfferTemplate = (offers) => offers.length > 0
  ? offers
    .map(
      ({ title, price }) => `
    <li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`,
    )
    .join('')
  : '';

const createPointTemplate = (pointData) => {
  const {
    type,
    offers,
    destination,
    basicPrice,
    dateStart,
    dateEnd,
    isFavorite,
  } = pointData;

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${humanizeDate(dateStart, 'YYYY-MM-DDTHH:mm')}">${humanizeDate(dateStart,  'MMM D')}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${destination.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${humanizeDate(dateStart, 'YYYY-MM-DDTHH:mm')}">${humanizeDate(dateStart, 'HH:mm')}</time>
      &mdash;
      <time class="event__end-time" datetime="${humanizeDate(dateEnd, 'YYYY-MM-DDTHH:mm')}">${humanizeDate(dateEnd, 'HH:mm')}</time>
    </p>
    <p class="event__duration">${getTimeDuration(dateStart, dateEnd)}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basicPrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${createPointOfferTemplate(offers)}
  </ul>
  <button class="event__favorite-btn ${favoriteClassName}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>
`;
};

export default class PointView extends AbstractView {
  constructor(pointData) {
    super();
    this._point = pointData;

    this._rollUpButtonClickHandler = this._rollUpButtonClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _rollUpButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollUpButtonClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setRollUpButtonClickHandler(callback) {
    this._callback.rollUpButtonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollUpButtonClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
