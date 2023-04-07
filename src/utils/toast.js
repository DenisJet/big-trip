const SHOW_TIME = 5000;

const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

export const toast = (message) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-container__item');

  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};

export const toastPermanent = () => {
  const toastItemElement = document.createElement('div');
  toastItemElement.textContent = 'we are offline';
  toastItemElement.classList.add('toast-container__item', 'toast-container__item--permanent');
  toastContainer.append(toastItemElement);
};

export const toastRemove = () => {
  const toastItemElement = toastContainer.querySelector('.toast-container__item--permanent');
  if (toastItemElement) {
    toastItemElement.remove();
  }
};
