import PointEditView from '../view/point-edit-view';
import { remove, render } from '../utils/render-utils';
import { RenderPosition } from '../const';
import { UserAction, UpdateType } from '../const';
import { isEscEvent } from '../utils/common';

export default class PointNewPresenter {
  constructor(pointsListContainer, changeData) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(offersData, destinationsData) {
    this._offersData = offersData;
    this._destinationsData = destinationsData;

    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new PointEditView(this._offersData, this._destinationsData);

    this._pointEditComponent.setRollUpButtonClickHandler(this._handleButtonCloseClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointsListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    this._buttonNewRemoveDisabled();
    if (this._pointEditComponent === null) {
      return;
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  _buttonNewRemoveDisabled() {
    const button = document.querySelector('.trip-main__event-add-btn');

    if (button.hasAttribute('disabled')) {
      button.removeAttribute('disabled');
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleButtonCloseClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
