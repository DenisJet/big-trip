import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { CITIES, TYPES } from '../const';
import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomArray
} from '../utils/common';
import { destinationsData, offersData } from '../main';
import { getRequiredOffers, getRequiredDestination } from '../utils/point-utils';

const generateDate = () => {
  let startDate = dayjs().add(getRandomInteger(-7, -4), 'd');
  return () => {
    const start = dayjs(startDate).add(getRandomInteger(-4320, 4320), 'm').toDate();
    const end = dayjs(start).add(getRandomInteger(30, 1620), 'm').toDate();
    startDate = end;
    return {
      start,
      end,
    };
  };
};

const getDates = generateDate();

export const generatePoint = () => {
  const date = getDates();
  const type = getRandomArrayElement(TYPES);
  const name = getRandomArrayElement(CITIES);
  const requiredDestination = getRequiredDestination(name, destinationsData);
  const requiredOffers = getRequiredOffers(type, offersData);

  return {
    id: nanoid(),
    type: type,
    offers: getRandomArray(requiredOffers),
    destination: {
      name: name,
      description: requiredDestination.description,
      pictures: requiredDestination.pictures,
    },
    basicPrice: getRandomInteger(100, 1100),
    dateStart: date.start,
    dateEnd: date.end,
    isFavorite: Boolean(getRandomInteger()),
  };
};
