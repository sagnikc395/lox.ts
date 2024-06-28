import { CallableFunc, type Callable } from "./callable";
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
import { RuntimeError } from "./runtime-error";
import {
  Return,
  type Block,
  type Expr,
  type Function,
  type If,
  type Print,
  type Statement,
  type StatementVisitor,
  type Var,
  type While,
} from "./statement";
import Token from "./token";
import type { LiteralValue } from "./tokentype";
import TokenType from "./tokentype";

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

  private stringify(literal: LiteralValue) {
    if (literal === null) return "nil";

    if (typeof literal === "number") {
      return Number(literal).toString();
    }

    return `${literal}`;
  }

  private checkNumberOperand(operator: Token, operand: LiteralValue) {
    if (typeof operand === "number") return;
    throw new RuntimeError(operator, `Operand must be numbers.`);
  }

  private checkNumberOperands(
    operator: Token,
    left: LiteralValue,
    right: LiteralValue
  ) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new RuntimeError(operator, `Operands must be numbers.`);
  }

  private evaluate(expr: Expression) {
    return expr.accept(this);
  }
  visitBinaryExpr(expr: Binary): unknown {
    throw new Error("Method not implemented.");
  }
  visitUnaryExpr(expr: Unary): unknown {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.BANG:
        return !Boolean(right);
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -Number(right);
    }
  }
  visitGroupingExpr(expr: Grouping): unknown {
    return this.evaluate(expr.expression);
  }
  visitLiteralExpr(expr: Literal): unknown {
    return expr.value;
  }
  visitVariableExpr(expr: Variable): unknown {
    throw new Error("Method not implemented.");
  }
  visitAssignExpr(expr: Assign): unknown {
    const value = this.evaluate(expr.value);
    const record = this.locals[expr.name.toString()];

    if (record !== undefined) {
      this.env.assignAt(record.depth, expr.name, value);
    } else {
      this.global.assign(expr.name, value);
    }
    return value;
  }
  visitLogicalExpr(expr: Logical): unknown {
    const left = this.evaluate(expr.left);
    if (expr.operator.type === TokenType.OR) {
      if (Boolean(left)) return left;
    } else {
      if (!Boolean(left)) return left;
    }
    return this.evaluate(expr.right);
  }
  visitCallExpr(expr: Call): unknown {
    throw new Error("Method not implemented.");
  }
  visitExpressionStatement(stmt: Expr): void {
    this.evaluate(stmt.expression);
  }
  visitPrintStatement(stmt: Print): void {
    const value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
  }
  visitVarStatement(stmt: Var): void {
    let value = null;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }
    this.env.define(stmt.name.lexeme, value);
  }
  visitBlockStatement(stmt: Block): void {
    this.executeBlock(stmt.statements, new Environment(this.env));
  }
  visitIfStatement(stmt: If): void {
    if (Boolean(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
  }
  visitWhileStatement(stmt: While): void {
    while (Boolean(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
  }
  visitFunctionStatement(stmt: Function): void {
    const func = new CallableFunc(stmt, this.env);
    this.env.define(stmt.name.lexeme, func);
    return;
  }
  visitReturnStatement(stmt: Return): void {
    let value = null;
    if (stmt.value !== null) value = this.evaluate(stmt.value);
    throw new Return(value);
  }
}
