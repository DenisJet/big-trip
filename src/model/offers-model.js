import Observer from '../utils/observer';

export default class OffersModel extends Observer {
  constructor() {
    super();
    this._offersData = [];
  }

  setOffers(updateType, offersData) {
    this._offersData = offersData;

    this._notify(updateType);
  }

  getOffers() {
    return this._offersData;
  }
}
