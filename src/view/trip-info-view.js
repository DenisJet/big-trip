import { humanizeDate } from '../utils/point-utils';
import AbstractView from './abstract-view';

const getRoute = (pointsData) => {
  const routePoints = [];
  pointsData.forEach((point) => routePoints.push(point.destination.name));
  const route =
    routePoints.length <= 3
      ? routePoints.join(' &#8212 ')
      : `${routePoints[0]} &#8212 &#8230 &#8212 ${routePoints[routePoints.length - 1]
      }`;

  return route;
};

const getDates = (pointsData) => pointsData && pointsData.length
  ? `${humanizeDate(pointsData[0].dateStart, 'MMM D')} &mdash; ${humanizeDate(
    pointsData[pointsData.length - 1].dateEnd,
    'MMM D',
  )}`
  : '';

const getTripCost = (pointsData) => {
  let totalBasicPrice = 0;
  let totalOffersPrice = 0;
  pointsData.forEach((point) => {
    totalBasicPrice += point.basicPrice;
    point.offers.forEach((offer) => (totalOffersPrice += offer.price));
  });

  return totalBasicPrice + totalOffersPrice;
};

const createTripInfoTemplate = (pointsData) => `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
     <h1 class="trip-info__title">${getRoute(pointsData)}</h1>
     <p class="trip-info__dates">${getDates(pointsData)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(pointsData)}</span>
    </p>
  </section>`;

export default class TripInfoView extends AbstractView {
  constructor(pointsData) {
    super();
    this._pointsData = pointsData;
  }

  getTemplate() {
    return createTripInfoTemplate(this._pointsData);
  }
}
