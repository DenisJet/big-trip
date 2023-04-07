import { RenderPosition, UpdateType, FilterType } from '../const';
import { render, remove, replace } from '../utils/render-utils';
import { filter } from '../utils/filter-utils';
import FilterView from '../view/filters-views';

export default class FiltersPresenter {
  constructor(filtersContainer, filtersModel, pointsModel) {
    this._filtersContainer = filtersContainer;
    this._filtersModel = filtersModel;
    this._pointsModel = pointsModel;

    this._filtersComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFiltersComponent = this._filtersComponent;

    this._filtersComponent = new FilterView(filters, this._filtersModel.getFilter());

    this._filtersComponent.setFilterChangeHandler(this._handleFilterTypeChange);

    if (prevFiltersComponent === null) {
      render(this._filtersContainer, this._filtersComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  destroy() {
    remove(this._filtersComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filtersModel.getFilter() === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const pointsData = this._pointsModel.getPoints();

    return [
      {
        name: FilterType.EVERYTHING,
        count: filter[FilterType.EVERYTHING](pointsData).length,
      },
      {
        name: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](pointsData).length,
      },
      {
        name: FilterType.PAST,
        count: filter[FilterType.PAST](pointsData).length,
      },
    ];
  }

  setFiltersDisabled() {
    const filters = this._filtersContainer.querySelectorAll('.trip-filters__filter-input');

    filters.forEach((filterItem) => {
      filterItem.setAttribute('disabled', 'disabled');
    });
  }

  setFiltersRemoveDisabled() {
    const filters = this._filtersContainer.querySelectorAll('.trip-filters__filter-input');

    filters.forEach((filterItem) => {
      if (filterItem.hasAttribute('disabled')) {
        filterItem.removeAttribute('disabled');
      }
    });
  }
}
