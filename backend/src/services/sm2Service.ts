export type SM2Quality = 0 | 1 | 2 | 3 | 4 | 5;

// Quality mapping:
// 5 - perfect response
// 4 - correct response after a hesitation
// 3 - correct response recalled with serious difficulty
// 2 - incorrect response; where the correct one seemed easy to recall
// 1 - incorrect response; the correct one remembered
// 0 - complete blackout

export interface SM2Result {
  interval: number; // in days
  reviewCount: number;
  easeFactor: number;
}

export const calculateSM2 = (
  quality: SM2Quality,
  reviewCount: number,
  previousInterval: number,
  previousEaseFactor: number
): SM2Result => {
  let interval: number;
  let easeFactor: number;
  let newReviewCount = reviewCount;

  if (quality >= 3) {
    if (newReviewCount === 0) {
      interval = 1;
    } else if (newReviewCount === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * previousEaseFactor);
    }
    newReviewCount++;
  } else {
    newReviewCount = 0;
    interval = 1;
  }

  easeFactor =
    previousEaseFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return {
    interval,
    reviewCount: newReviewCount,
    easeFactor,
  };
};

export const getNextReviewDate = (interval: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + interval);
  return date;
};
