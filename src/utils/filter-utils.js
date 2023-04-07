import {
  isDateCurrent,
  isDateInPast,
  isDateInFuture,
  isEventContinues
} from '../utils/point-utils';
import { FilterType } from './../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) =>
    points.filter(
      (point) =>
        isDateInFuture(point.dateStart) ||
        isDateCurrent(point.dateStart) ||
        isEventContinues(point.dateStart, point.dateEnd),
    ),
  [FilterType.PAST]: (points) =>
    points.filter(
      (point) =>
        isDateInPast(point.dateEnd) ||
        isEventContinues(point.dateStart, point.dateEnd),
    ),
};
