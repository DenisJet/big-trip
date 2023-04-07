import Observer from '../utils/observer';

export default class DestinationsModel extends Observer {
  constructor() {
    super();
    this._destinationsData = [];
  }

  setDestinations(updateType, destinationsData) {
    this._destinationsData = destinationsData;

    this._notify(updateType);
  }

  getDestinations() {
    return this._destinationsData;
  }
}
