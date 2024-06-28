import { Environment } from "./environment";
import type { Expression, ExpressionVisitor } from "./expression";
import type { StatementVisitor } from "./statement";
import type { LiteralValue } from "./tokentype";

export class Interpreter
  implements ExpressionVisitor<LiteralValue>, StatementVisitor<void>
{
  constructor() {
    this.global = new Environment();
    this.locals = {};

    this.global.define(
      "clock",
      new(class implements Callable {

      })();
    )
  }
}
