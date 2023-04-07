import SiteNavView from './view/site-nav-view';
import StatisticsView from './view/statistics-view';
import ErrorView from './view/error-view';
import BoardPresenter from './presenter/board-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FiltersModel from './model/filters-model';
import { isOnline } from './utils/common';
import { toast, toastPermanent, toastRemove } from './utils/toast';
import { render, remove } from './utils/render-utils';
import { NavItems, RenderPosition, UpdateType } from './const';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

const AUTORIZATION_KEY = 'Basic sg8svkxv98876ejjx9ks9kq5';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_VER = 'v14';
const STORE_POINTS_PREFIX = 'bigtrip-points-localstorage';
const STORE_POINTS_NAME = `${STORE_POINTS_PREFIX}-${STORE_VER}`;
const STORE_OFFERS_PREFIX = 'bigtrip-offers-localstorage';
const STORE_OFFERS_NAME = `${STORE_OFFERS_PREFIX}-${STORE_VER}`;
const STORE_DESTINATIONS_PREFIX = 'bigtrip-destinations-localstorage';
const STORE_DESTINATIONS_NAME = `${STORE_DESTINATIONS_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTORIZATION_KEY);
const storePoints = new Store(STORE_POINTS_NAME, window.localStorage);
const apiWithProviderPoints = new Provider(api, storePoints);
const storeOffers = new Store(STORE_OFFERS_NAME, window.localStorage);
const apiWithProviderOffers = new Provider(api, storeOffers);
const storeDestinations = new Store(STORE_DESTINATIONS_NAME, window.localStorage);
const apiWithProviderDestinations = new Provider(api, storeDestinations);

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filtersModel = new FiltersModel();

const siteBodyElement = document.querySelector('.page-body');
const mainElement = siteBodyElement.querySelector('.page-main');
const pageContainer = mainElement.querySelector('.page-body__container');
const navigationElement = siteBodyElement.querySelector('.trip-controls__navigation');
const tripInfoElement = siteBodyElement.querySelector('.trip-main');
const filtersElement = siteBodyElement.querySelector('.trip-controls__filters');
const tripBoardElement = siteBodyElement.querySelector('.trip-events');

const siteNavComponent = new SiteNavView();
const errorComponent = new ErrorView();

const boardPresenter = new BoardPresenter(tripBoardElement, tripInfoElement, pointsModel, offersModel, destinationsModel, filtersModel, apiWithProviderPoints);
const filtersPresenter = new FiltersPresenter(filtersElement, filtersModel, pointsModel);

let statisticsComponent = null;
let isLoadingOffersDone = false;
let isLoadingDestinationsDone = false;

const handleSiteNavClick = (navItem) => {
  switch (navItem) {
    case NavItems.TABLE:
      boardPresenter.init();
      boardPresenter.buttonNewRemoveDisabled();
      filtersPresenter.setFiltersRemoveDisabled();
      pageContainer.classList.toggle('page-body__container--table');
      remove(statisticsComponent);
      break;
    case NavItems.STATS:
      boardPresenter.destroy();
      boardPresenter.buttonNewSetDisabled();
      filtersPresenter.setFiltersDisabled();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      pageContainer.classList.toggle('page-body__container--table');
      render(pageContainer, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

const buttonNewClickHandler = (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast('You can\'t create new task offline');
    return;
  }

  boardPresenter.createPoint();
};

const onLoadingErrorHandler = () => {
  boardPresenter.destroy();
  document.querySelector('.trip-main__event-add-btn').removeEventListener('click', buttonNewClickHandler);
  render(tripBoardElement, errorComponent, RenderPosition.AFTERBEGIN);
  filtersPresenter.destroy();
};

filtersPresenter.init();
boardPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', buttonNewClickHandler);

apiWithProviderPoints.getPoints().then((points) => {
  pointsModel.setPoints(UpdateType.INIT_POINTS, points);
}).catch(() => {
  pointsModel.setPoints(UpdateType.INIT_POINTS, []);
});

apiWithProviderOffers.getOffers().then((offers) => {
  isLoadingOffersDone = true;
  offersModel.setOffers(UpdateType.INIT_OFFERS, offers);
}).catch(() => {
  onLoadingErrorHandler();
});

apiWithProviderDestinations.getDestinations().then((destinations) => {
  isLoadingDestinationsDone = true;
  destinationsModel.setDestinations(UpdateType.INIT_DESTINATIONS, destinations);

  if (isLoadingOffersDone && isLoadingDestinationsDone) {
    boardPresenter.buttonNewRemoveDisabled();
    render(navigationElement, siteNavComponent, RenderPosition.BEFOREEND);
    siteNavComponent.setNavClickHandler(handleSiteNavClick);
  }
}).catch(() => {
  onLoadingErrorHandler();
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
  if (!isOnline()) {
    toastPermanent();
  }
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProviderPoints.sync();
  toastRemove();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toastPermanent();
});
