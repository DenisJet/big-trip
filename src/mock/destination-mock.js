import { getRandomArray, getRandomInteger } from '../utils/common';
import { CITIES } from '../const';

const generateDescription = () => {
  const descriptionsArray = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  ];

  return getRandomArray(descriptionsArray, 1, 5).join(' ');
};

const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${Math.random()}`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
});

const generatePicturesArray = () => new Array(getRandomInteger(1, 5)).fill().map(generatePicture);

export const generateDestination = () => {
  const destinations = CITIES.map((city) => ({
    name: city,
    description: generateDescription(),
    pictures: generatePicturesArray(),
  }));

  return destinations;
};
