export const CITIES = [
  'Krasnoyarsk',
  'Yakutsk',
  'Novosibirsk',
  'Kazan',
  'Innopolis',
  'Chelyabinsk',
  'Ekaterinburg',
];

export const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT_POINTS: 'INIT_POINTS',
  INIT_OFFERS: 'INIT_OFFERS',
  INIT_DESTINATIONS: 'INIT_DESTINATIONS',
};

export const NavItems = {
  TABLE: 'Table',
  STATS: 'Stats',
};
