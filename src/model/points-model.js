import Observer from '../utils/observer';

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._pointsData = [];
  }

  setPoints(updateType, pointsData) {
    this._pointsData = pointsData.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._pointsData;
  }

  updatePoint(updateType, update) {
    const index = this._pointsData.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._pointsData = [
      ...this._pointsData.slice(0, index),
      update,
      ...this._pointsData.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._pointsData = [update, ...this._pointsData];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._pointsData.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._pointsData = [
      ...this._pointsData.slice(0, index),
      ...this._pointsData.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        basicPrice: point.base_price,
        dateStart: point.date_from !== null ? new Date(point.date_from) : point.date_from,
        dateEnd: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        isFavorite: point.is_favorite,
      },
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'base_price': point.basicPrice,
        'date_from': new Date(point.dateStart).toISOString(),
        'date_to': new Date(point.dateEnd).toISOString(),
        'is_favorite': point.isFavorite,
      },
    );

    delete adaptedPoint.basicPrice;
    delete adaptedPoint.dateStart;
    delete adaptedPoint.dateEnd;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
