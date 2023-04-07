import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import { render, replace, remove } from '../utils/render-utils';
import { RenderPosition } from '../const';
import { isEscEvent, isOnline } from '../utils/common';
import { UserAction, UpdateType } from '../const';
import { isDatesEqual } from '../utils/point-utils';
import { toast } from '../utils/toast';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ABORTING: 'ABORTING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class PointPresenter {
  constructor(pointsListContainer, changeData, changeMode) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleButtonOpenClick = this._handleButtonOpenClick.bind(this);
    this._handleButtonCloseClick = this._handleButtonCloseClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(pointData, offersData, destinationsData) {
    this._pointData = pointData;
    this._offersData = offersData;
    this._destinationsData = destinationsData;
    this._isEditMode = true;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(this._pointData);
    this._pointEditComponent = new PointEditView(this._offersData, this._destinationsData, this._pointData, this._isEditMode);

    this._pointComponent.setRollUpButtonClickHandler(this._handleButtonOpenClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setRollUpButtonClickHandler(this._handleButtonCloseClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointsListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    } else {
      replace(this._pointEditComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceCardToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._pointData);
      this._replaceFormToCard();
    }
  }

  _handleButtonOpenClick() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }

    this._replaceCardToForm();
  }

  _handleButtonCloseClick() {
    this._pointEditComponent.reset(this._pointData);
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._pointData,
        {
          isFavorite: !this._pointData.isFavorite,
        },
      ),
    );
  }

  _handleFormSubmit(point) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }

    const isMinorUpdate =
      !isDatesEqual(this._pointData.dateStart, point.dateStart) ||
      !isDatesEqual(this._pointData.dateEnd, point.dateEnd) ||
      !(this._pointData.basicPrice === point.basicPrice) ||
      !(this._pointData.offers === point.offers);

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point,
    );
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      return;
    }

    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
