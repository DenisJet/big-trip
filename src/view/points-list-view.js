import AbstractView from './abstract-view';

const createPointsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointsListView extends AbstractView {
  getTemplate() {
    return createPointsListTemplate();
  }
}
