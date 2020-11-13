export class NotFoundException {
  message: string;

  constructor(id: string) {
    this.message = `Object with id:'${id}' not found`;
  }
}

export class ValidationException {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

