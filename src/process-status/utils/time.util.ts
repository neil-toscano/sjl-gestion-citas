import { TimeRemaining } from '../interfaces/time-remaining';

export function getTimeRemaining(updatedAt: Date): TimeRemaining {
  const updatedDate = new Date(updatedAt);
  const now = new Date();

  const twoWeeksLater = new Date(updatedDate);
  twoWeeksLater.setDate(updatedDate.getDate() + 14);

  const timeRemaining = twoWeeksLater.getTime() - now.getTime();

  if (timeRemaining <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return { expired: false, days, hours, minutes };
}
