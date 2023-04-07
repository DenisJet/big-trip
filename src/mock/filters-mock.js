import {
  isDateCurrent,
  isDateInPast,
  isDateInFuture,
  isEventContinues
} from '../utils/point-utils';
import { FilterType } from './../const.js';

const pointToFilterMap = {
  [FilterType.EVERYTHING]: (points) => points.length,
  [FilterType.FUTURE]: (points) =>
    points.filter(
      (point) =>
        isDateInFuture(point.dateStart) ||
        isDateCurrent(point.dateStart) ||
        isEventContinues(point.dateStart, point.dateEnd),
    ).length,
  [FilterType.PAST]: (points) =>
    points.filter(
      (point) =>
        isDateInPast(point.dateEnd) ||
        isEventContinues(point.dateStart, point.dateEnd),
    ).length,
};

export const generateFilter = (points) =>
  Object.entries(pointToFilterMap).map(([filterName, countPoints]) => ({
    name: filterName,
    count: countPoints(points),
  }));
