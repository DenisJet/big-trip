import AbstractView from './abstract-view';

const createFilterTemplate = (filterData, currentFilter) => `<form class="trip-filters" action="#" method="get">
  ${filterData
    .map(
      ({ name, count }) =>
        `<div class="trip-filters__filter">
    <input id="filter-${name.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${name === currentFilter ? 'checked' : ''
} ${count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name.toLowerCase()}">${name} ${count === 0 ? '' : count
}</label>
    </div>`,
    )
    .join('')}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;

export default class FilterView extends AbstractView {
  constructor(filtersData, currentFilter) {
    super();
    this._filtersData = filtersData;
    this._currentFilter = currentFilter;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filtersData, this._currentFilter);
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.filterChange(evt.target.value);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.getElement().addEventListener('change', this._filterChangeHandler);
  }
}
