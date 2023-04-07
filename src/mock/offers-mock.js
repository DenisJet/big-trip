import { getRandomArray } from '../utils/common';
import { TYPES } from '../const';

const generateOneTypeOffers = (type) => {
  const availableOffers = [
    {
      title: 'Choose seats',
      price: 5,
    },
    {
      title: 'Travel by train',
      price: 40,
    },
    {
      title: 'Order uber',
      price: 20,
    },
    {
      title: 'Add luggage',
      price: 50,
    },
    {
      title: 'Add meal',
      price: 15,
    },
    {
      title: 'Switch to comfort',
      price: 80,
    },
  ];

  return {
    type: type,
    offers: getRandomArray(availableOffers, 0, 5),
  };
};

export const generateOffers = () =>
  TYPES.map((type) => generateOneTypeOffers(type));
