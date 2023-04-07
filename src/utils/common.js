// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// случайное булевое значение

export const randomBoolean = () => Math.random() >= 0.5;

//случайный элемент массива

export const getRandomArrayElement = (array) =>
  array[getRandomInteger(0, array.length - 1)];

//случайный массив из другого массива

export const getRandomArray = (
  array,
  minLength = 0,
  maxLength = array.length,
) => {
  const randomArray = [];

  for (let i = minLength; i < maxLength; i++) {
    if (randomBoolean()) {
      randomArray.push(array[i]);
    }
  }

  return randomArray;
};

//isEscEvent

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

///isOnLine

export const isOnline = () =>  window.navigator.onLine;

///

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
