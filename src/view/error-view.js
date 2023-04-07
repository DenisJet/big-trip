import AbstractView from './abstract-view';

const createErrorTemplate = () => `
  <p class="trip-events__msg trip-events__msg--error">Error while loading... Try again later</p>
`;


export default class ErrorView extends AbstractView {
  getTemplate() {
    return createErrorTemplate();
  }
}
