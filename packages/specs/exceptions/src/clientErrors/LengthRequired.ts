import {ClientException} from "../core/ClientException.js";

export class LengthRequired extends ClientException {
  static readonly STATUS = 411;

  constructor(message: string, origin?: Error | string | any) {
    super(LengthRequired.STATUS, message, origin);
  }
}
