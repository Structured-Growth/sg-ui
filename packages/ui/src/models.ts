export type LearnerClass = {
  id: string;
  courseName: string;
  instructorName: string;
  siteName: string;
  progressPercent: number;
  nextActivity: string;
  nextActivityId?: string;
  nextActivityLaunchPath?: string;
  dueAt: string;
};
