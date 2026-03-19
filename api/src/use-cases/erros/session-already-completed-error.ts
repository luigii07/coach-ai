export class SessionAlreadyCompletedError extends Error {
  constructor() {
    super('This session has already been completed')
  }
}
