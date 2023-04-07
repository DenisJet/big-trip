import TripInfoView from '../view/trip-info-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import NoPointsView from '../view/no-points-view';
import LoadingView from '../view/loading-view';
import PointPresenter, {State as PointPresenterViewState} from './point-presenter';
import PointNewPresenter from './point-new-presenter';
import { render, remove } from '../utils/render-utils';
import { FilterType, RenderPosition, SortType, UpdateType, UserAction } from '../const';
import { sortByDay, sortByPrice, sortByTime } from '../utils/point-utils';
import { filter } from '../utils/filter-utils';

export default class BoardPresenter {
  constructor(boardContainer, tripInfoContainer, pointsModel, offersModel, destinationsModel, filtersModel, api) {
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filtersModel = filtersModel;
    this._boardContainer = boardContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._api = api;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._isLoadingPoints = true;
    this._isLoadingOffers = true;
    this._isLoadingDestinations = true;

    this._offers = null;
    this._destinations = null;

    this._sortComponent = null;
    this._tripInfoComponent = null;
    this._pointsListComponent = new PointsListView();
    this._noPointsComponent = new NoPointsView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListComponent, this._handleViewAction);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetSortType: true, dontResetTripInfo: true});

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
    this._offersModel.removeObserver(this._handleModelEvent);
    this._destinationsModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this.buttonNewSetDisabled();
    this._currentSortType = SortType.DAY;
    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(this._offers, this._destinations);
  }

  buttonNewSetDisabled() {
    document.querySelector('.trip-main__event-add-btn').setAttribute('disabled', 'disabled');
  }

  buttonNewRemoveDisabled() {
    const button = document.querySelector('.trip-main__event-add-btn');

    if (button.hasAttribute('disabled')) {
      button.removeAttribute('disabled');
    }
  }

  _getPoints() {
    const filterType = this._filtersModel.getFilter();
    const pointsData = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](pointsData);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      default:
        throw new Error('Unknow sort type');
    }
  }

  _getOffers() {
    this._offers = this._offersModel.getOffers();
  }

  _getDestinations() {
    this._destinations = this._destinationsModel.getDestinations();
  }

  _handleModeChange() {
    this.buttonNewRemoveDisabled();
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
            this.buttonNewRemoveDisabled();
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenter[data.id].init(data, this._offers, this._destinations);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача удалена)
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT_POINTS:
        this._isLoadingPoints = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
      case UpdateType.INIT_OFFERS:
        this._isLoadingOffers = false;
        this._offers = this._offersModel.getOffers();
        this._renderBoard();
        break;
      case UpdateType.INIT_DESTINATIONS:
        this._isLoadingDestinations = false;
        this._destinations = this._destinationsModel.getDestinations();
        this._renderBoard();
        break;
      default:
        throw new Error('Unknown update-type. Check UpdateType value');
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPointsList() {
    render(this._boardContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(pointData, offersData, destinationsData) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(pointData, offersData, destinationsData);
    this._pointPresenter[pointData.id] = pointPresenter;
  }

  _renderPoints() {
    this._getPoints().forEach((point) => {
      this._renderPoint(point, this._offers, this._destinations);
    });
  }

  _renderNoPoints() {
    render(this._boardContainer, this._noPointsComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    this._tripInfoComponent = new TripInfoView(this._getPoints());
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _clearBoard({resetSortType = false, dontResetTripInfo = false} = {}) {
    Object.values(this._pointPresenter).forEach((pointPresenter) => pointPresenter.destroy());
    this._pointPresenter = {};
    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._pointsListComponent);
    remove(this._noPointsComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }

    if(dontResetTripInfo) {
      return;
    }

    remove(this._tripInfoComponent);
    this._tripInfoComponent = null;
  }

  _renderBoard() {
    if (this._isLoadingPoints || this._isLoadingOffers || this._isLoadingDestinations) {
      this._renderLoading();
      return;
    }
    remove(this._loadingComponent);

    if (this._getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderPointsList();
    this._renderSort();
    this._renderPoints();

    if (this._tripInfoComponent === null) {
      this._renderTripInfo();
    }
  }
}
