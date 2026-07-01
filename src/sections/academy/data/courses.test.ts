import { ACADEMY_COURSES } from './courses';

jest.mock('src/interfaces/seller/seller-status', () => ({
  SELLER_STATUS: { APPROVED: 'APPROVED', PENDING: 'PENDING' },
}));

describe('ACADEMY_COURSES', () => {
  it('is an array', () => {
    expect(Array.isArray(ACADEMY_COURSES)).toBe(true);
  });

  it('has at least 1 course', () => {
    expect(ACADEMY_COURSES.length).toBeGreaterThan(0);
  });

  it('each course has required fields', () => {
    ACADEMY_COURSES.forEach((course) => {
      expect(course.id).toBeTruthy();
      expect(course.titleKey).toBeTruthy();
      expect(course.thumbnail).toBeTruthy();
      expect(course.level).toBeTruthy();
      expect(Array.isArray(course.lessons)).toBe(true);
    });
  });

  it('getting-started course exists', () => {
    const course = ACADEMY_COURSES.find((c) => c.id === 'getting-started');
    expect(course).toBeDefined();
    expect(course!.level).toBe('beginner');
  });

  it('all courses have at least 1 lesson', () => {
    ACADEMY_COURSES.forEach((course) => {
      expect(course.lessons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('each lesson has required fields', () => {
    ACADEMY_COURSES.forEach((course) => {
      course.lessons.forEach((lesson) => {
        expect(lesson.id).toBeTruthy();
        expect(lesson.title).toBeTruthy();
        expect(lesson.videoUrl).toBeTruthy();
        expect(typeof lesson.durationMinutes).toBe('number');
      });
    });
  });
});
