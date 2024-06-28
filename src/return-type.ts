import type { LiteralValue } from "./tokentype";

export class Return extends Error {
  value: LiteralValue;
  constructor(value: LiteralValue) {
    super();
    this.value = value;
  }
}
