export class SessionAlreadyStartedError extends Error {
  constructor() {
    super('A session has already been started for this train today')
  }
}
