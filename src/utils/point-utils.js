import dayjs from 'dayjs';

export const humanizeDate = (date, format) => dayjs(date).format(format);

export const isDateInPast = (date) => dayjs().isAfter(date);
export const isDateInFuture = (date) => dayjs().isBefore(date);
export const isDateCurrent = (date) => dayjs().isSame(date);
export const isEventContinues = (dateStart, dateEnd) =>
  isDateInPast(dateStart) && isDateInFuture(dateEnd);

//timeDuration

export const getTimeDuration = (dateStart, dateEnd) => {
  const date1 = dayjs(dateStart);
  const date2 = dayjs(dateEnd);
  const difference = date2.diff(date1, 'minute');
  const daysDiff =
    difference / 1440 > 1 ? `${Math.trunc(difference / 1440)}D` : '';
  const hoursDiff =
    (difference % 1440) / 60 > 1
      ? `${Math.trunc((difference % 1440) / 60)}H`
      : '';
  const minutesDiff = `${Math.trunc((difference % 1440) % 60)}M`;

  return `${daysDiff} ${hoursDiff} ${minutesDiff}`;
};

// Compare two dates

export const compareTwoDates = (dateA, dateB) => {
  if (dateA === null || dateB === null) {
    return null;
  }

  return dayjs(dateA).diff(dateB);
};

// SortBy

export const getWeightForEmptyValue = (valueA, valueB) => {
  if (valueA === null && valueB === null) {
    return 0;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  return null;
};

export const sortByDay = (pointA, pointB) => {
  const weight = getWeightForEmptyValue(pointA.dateStart, pointB.dateStart);

  if (weight !== null) {
    return weight;
  }

  return compareTwoDates(pointA.dateStart, pointB.dateStart);
};

export const sortByPrice = (pointA, pointB) => {
  const weight = getWeightForEmptyValue(pointA.basicPrice, pointB.basicPrice);

  if (weight !== null) {
    return weight;
  }

  return pointB.basicPrice - pointA.basicPrice;
};

export const sortByTime = (pointA, pointB) => {
  const durationPointA = compareTwoDates(pointA.dateEnd, pointA.dateStart);
  const durationPointB = compareTwoDates(pointB.dateEnd, pointB.dateStart);
  const weight = getWeightForEmptyValue(durationPointA, durationPointB);

  if (weight !== null) {
    return weight;
  }

  return durationPointB - durationPointA;
};

export const isDatesEqual = (dateA, dateB) =>
  dateA === null && dateB === null ? true : dayjs(dateA).isSame(dateB, 'm');

//

export const getRequiredOffers = (type, offersData) => {
  const requiredType = offersData.find((item) => item.type === type);
  return requiredType.offers;
};

export const getRequiredDestination = (city, destinationsData) => {
  const requiredCityDestination = destinationsData.find((item) => item.name === city);
  return requiredCityDestination;
};
