import AbstractView from './abstract-view';

const createLoadingTemplate = () => `
  <p class="trip-events__msg">Loading...</p>
`;

export default class LoadingView extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
