export class WorkoutPlanNotActiveError extends Error {
  constructor() {
    super('Workout plan not active.')
  }
}
