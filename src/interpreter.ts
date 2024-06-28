import type { Expression, ExpressionVisitor } from "./expression";
import type { StatementVisitor } from "./statement";
import type { LiteralValue } from "./tokentype";

export class Interpreter
  implements ExpressionVisitor<LiteralValue>, StatementVisitor<void>
{
  global: Environment;
  environment: Environment;
  locals: Record<string, { expr: Expression; depth: number }>;
  

  locals: Record<string, { expr: Expression; depth: number }>;
  constructor() {
    this.global = new Environment();
  }
}
