import SmartView from './smart-view';
import { TYPES } from '../const';
import { humanizeDate, getRequiredOffers, compareTwoDates } from '../utils/point-utils';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const BLANK_POINT = {
  type: TYPES[0],
  offers: [],
  destination: {
    name: '',
    description: '',
    pictures: '',
  },
  basicPrice: '',
  dateStart: dayjs().toDate(),
  dateEnd: dayjs().toDate(),
  isFavorite: false,
};

const createTypeItemTemplate = (availableTypes, currentType, isDisabled) => availableTypes
  .map(
    (type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`,
  )
  .join('');

const createDestinationOptionTemplate = (cities) => cities.map((city) => `<option value="${city}"></option>`).join('');

const createOffersTemplate = (offers, type, allOffers, isDisabled) => {
  const requiredOffers = getRequiredOffers(type, allOffers);
  let index = 0;

  return requiredOffers.length > 0
    ? `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${requiredOffers
    .map(({ title, price }) => {
      const offerClassName = `${title.split(' ').pop()} &ndash; ${index++}`;
      const checkedAttribute = offers.some((offer) => offer.title === title)
        ? 'checked'
        : '';
      return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerClassName}" type="checkbox" name="event-offer-${title}" value="${title}" ${checkedAttribute} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offerClassName}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
    })
    .join('')}
  </div>
</section>`
    : '';
};

const createDestinationTemplate = (destination) => destination
  ? `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description}</p>
  <div class="event__photos-container">
    <div class="event__photos-tape">
    ${destination.pictures && destination.pictures.length > 0
    ? destination.pictures
      .map(
        (pic) =>
          `<img class="event__photo" src="${pic.src}" alt="Event photo"></img>`,
      )
      .join('')
    : ''
}
    </div>
  </div>
</section>`
  : '';

const createPointEditTemplate = (pointData, offersData, availableCities, isEditMode) => {
  const { type, offers, destination, basicPrice, dateStart, dateEnd, isDisabled, isSaving, isDeleting } = pointData;

  const isSubmitDisabled = dateStart === null || dateEnd === null;

  const getButtonDeleteState = () => {
    if (isEditMode && isDeleting) {
      return 'Deleting..';
    }

    if (isEditMode) {
      return 'Delete';
    }

    return 'Cancel';
  };

  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${createTypeItemTemplate(TYPES, type, isDisabled)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name
}" list="destination-list-1" required ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list-1">
        ${createDestinationOptionTemplate(availableCities)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(
    dateStart, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(
    dateEnd, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basicPrice}" required ${isDisabled ? 'disabled' : ''}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''} ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
      ${getButtonDeleteState()}
    </button>
    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    ${createOffersTemplate(offers, type, offersData, isDisabled)}
    ${createDestinationTemplate(destination)}
  </section>
</form>
</li>`;
};

export default class PointEditView extends SmartView {
  constructor(offersData, destinationsData, pointData = BLANK_POINT, isEditMode) {
    super();
    this._state = PointEditView.parseDataToState(pointData);
    this._offersData = offersData;
    this._destinationsData = destinationsData;
    this._availableCities = this._getAvailableCities();
    this._dateStartPicker = null;
    this._dateEndPicker = null;
    this._isEditMode = isEditMode;

    this._rollUpButtonClickHandler = this._rollUpButtonClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._typeHandler = this._typeHandler.bind(this);
    this._destinationHandler = this._destinationHandler.bind(this);
    this._priceHandler = this._priceHandler.bind(this);
    this._offersHandler = this._offersHandler.bind(this);
    this._dateStartHandler = this._dateStartHandler.bind(this);
    this._dateEndHandler = this._dateEndHandler.bind(this);

    this._setInnerHandlers();
    this._setDateStartPicker();
    this._setDateEndPicker();
  }

  removeElement() {
    super.removeElement();

    if (this._dateStartPicker) {
      this._dateStartPicker.destroy();
      this._dateStartPicker = null;
    }

    if (this._dateEndPicker) {
      this._dateEndPicker.destroy();
      this._dateEndPicker = null;
    }
  }

  reset(pointData) {
    this.updateData(
      PointEditView.parseDataToState(pointData),
    );
  }

  getTemplate() {
    return createPointEditTemplate(this._state, this._offersData, this._availableCities, this._isEditMode);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateStartPicker();
    this._setDateEndPicker();
    this.setRollUpButtonClickHandler(this._callback.rollUpButtonClickHandler);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceHandler);
    if (this.getElement().querySelector('.event__section--offers')) {
      this.getElement().querySelector('.event__section--offers').addEventListener('change', this._offersHandler);
    }
  }

  _setDateStartPicker() {
    if (this._dateStartPicker) {
      this._dateStartPicker.destroy();
      this._dateStartPicker = null;
    }

    if (this._state.dateStart) {
      this._dateStartPicker = flatpickr(
        this.getElement().querySelector('#event-start-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          defaultDate: this._state.dateStart,
          onChange: this._dateStartHandler,
        },
      );
    }
  }

  _setDateEndPicker() {
    if (this._dateEndPicker) {
      this._dateEndPicker.destroy();
      this._dateEndPicker = null;
    }

    if (this._state.dateEnd) {
      this._dateEndPicker = flatpickr(
        this.getElement().querySelector('#event-end-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          defaultDate: this._state.dateEnd,
          onChange: this._dateEndHandler,
        },
      );
    }
  }

  _dateStartHandler(userDateStart) {
    if (compareTwoDates(this._state.dateEnd, userDateStart) < 0) {
      this.updateData({
        dateStart: userDateStart,
        dateEnd: userDateStart,
      });
      return;
    }

    this.updateData({
      dateStart: userDateStart,
    });
  }

  _dateEndHandler(userDateEnd) {
    if (compareTwoDates(userDateEnd, this._state.dateStart) < 0) {
      userDateEnd = this._state.dateStart;
    }

    this.updateData({
      dateEnd: userDateEnd,
    });
  }

  _typeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _destinationHandler(evt) {
    evt.preventDefault();

    if (!this._availableCities.includes(evt.target.value)) {
      evt.target.setCustomValidity(`Выберите город из списка: ${this._availableCities.join(', ')}`);
    } else {
      evt.target.setCustomValidity('');
      this.updateData({
        destination: this._destinationsData.find((item) => item.name === evt.target.value),
      });
    }

    evt.target.reportValidity();
  }

  _priceHandler(evt) {
    evt.preventDefault();

    if (!/^\d+$/.test(evt.target.value)) {
      evt.target.setCustomValidity('Не корректное значение');
    } else {
      evt.target.setCustomValidity('');

      this.updateData({
        basicPrice: parseInt(evt.target.value, 10),
      });
    }

    evt.target.reportValidity();
  }

  _offersHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const selectedOffer = evt.target.value;
    const selectedOfferIndex = this._state.offers.findIndex((offer) => offer.title === selectedOffer);

    if (selectedOfferIndex < 0) {
      const requiredOffers = getRequiredOffers(this._state.type, this._offersData);
      const newOffer = requiredOffers.find((offer) => offer.title === selectedOffer);

      this.updateData({
        offers: [newOffer, ...this._state.offers],
      });
    } else {
      this.updateData({
        offers: [...this._state.offers.slice(0, selectedOfferIndex), ...this._state.offers.slice(selectedOfferIndex + 1, this._state.offers.length)],
      });
    }
  }

  _rollUpButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollUpButtonClickHandler();
  }

  setRollUpButtonClickHandler(callback) {
    this._callback.rollUpButtonClickHandler = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollUpButtonClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseStateToData(this._state));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  _getAvailableCities() {
    return this._destinationsData.map((destination) => destination.name);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();

    this._callback.deleteClick(PointEditView.parseStateToData(this._state));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;

    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  static parseDataToState(data) {
    return Object.assign(
      {},
      data,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseStateToData(state) {
    state =  Object.assign({}, state);

    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return state;
  }
}
