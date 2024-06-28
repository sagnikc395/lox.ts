import type { Callable } from "./callable";
import { Environment } from "./environment";
import type {
  Assign,
  Binary,
  Call,
  Expression,
  ExpressionVisitor,
  Grouping,
  Literal,
  Logical,
  Unary,
  Variable,
} from "./expression";
import Lox from "./lox";
import type { RuntimeError } from "./runtime-error";
import type {
  Block,
  Expr,
  Function,
  If,
  Print,
  Return,
  Statement,
  StatementVisitor,
  Var,
  While,
} from "./statement";
import type { LiteralValue } from "./tokentype";

export class Interpreter
  implements ExpressionVisitor<LiteralValue>, StatementVisitor<void>
{
  global: Environment;
  env: Environment;
  locals: Record<string, { expr: Expression; depth: number }>;
  constructor() {
    this.global = new Environment();
    this.locals = {};

    this.global.define(
      "clock",
      new (class implements Callable {
        arity(): number {
          return 0;
        }
        call(): unknown {
          return Date.now();
        }
      })()
    );
    this.env = this.global;
  }

  resolve(id: string, expr: Expression, depth: number) {
    this.locals[id] = { expr, depth };
  }

  interpret(statements: Statement[]) {
    try {
      for (const stmt of statements) {
        this.execute(stmt);
      }
    } catch (error) {
      const err = error as RuntimeError;
      Lox.runtimeError(err);
    }
  }

  private execute(stmt: Statement) {
    stmt.accept(this);
  }

  visitBinaryExpr(expr: Binary): unknown {
    throw new Error("Method not implemented.");
  }
  visitUnaryExpr(expr: Unary): unknown {
    throw new Error("Method not implemented.");
  }
  visitGroupingExpr(expr: Grouping): unknown {
    throw new Error("Method not implemented.");
  }
  visitLiteralExpr(expr: Literal): unknown {
    throw new Error("Method not implemented.");
  }
  visitVariableExpr(expr: Variable): unknown {
    throw new Error("Method not implemented.");
  }
  visitAssignExpr(expr: Assign): unknown {
    throw new Error("Method not implemented.");
  }
  visitLogicalExpr(expr: Logical): unknown {
    throw new Error("Method not implemented.");
  }
  visitCallExpr(expr: Call): unknown {
    throw new Error("Method not implemented.");
  }
  visitExpressionStatement(stmt: Expr): void {
    throw new Error("Method not implemented.");
  }
  visitPrintStatement(stmt: Print): void {
    throw new Error("Method not implemented.");
  }
  visitVarStatement(stmt: Var): void {
    throw new Error("Method not implemented.");
  }
  visitBlockStatement(stmt: Block): void {
    throw new Error("Method not implemented.");
  }
  visitIfStatement(stmt: If): void {
    throw new Error("Method not implemented.");
  }
  visitWhileStatement(stmt: While): void {
    throw new Error("Method not implemented.");
  }
  visitFunctionStatement(stmt: Function): void {
    throw new Error("Method not implemented.");
  }
  visitReturnStatement(stmt: Return): void {
    throw new Error("Method not implemented.");
  }
}
