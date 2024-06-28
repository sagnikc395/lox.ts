import { FunctionType } from "./callable";
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
import type { Interpreter } from "./interpreter";
import Lox from "./lox";
import { Stack } from "./stack";
import type {
  Block,
  Expr,
  If,
  Print,
  Return,
  Statement,
  StatementVisitor,
  Var,
  While,
} from "./statement";
import type Token from "./token";

export class Resolver
  implements StatementVisitor<void>, ExpressionVisitor<void>
{
  interpreter: Interpreter;
  scopes: Stack<Record<string, boolean>>;

  currentFunc: FunctionType = FunctionType.NONE;

  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter;
    this.scopes = new Stack();
  }
  visitBinaryExpr(expr: Binary): void {
    throw new Error("Method not implemented.");
  }
  visitUnaryExpr(expr: Unary): void {
    throw new Error("Method not implemented.");
  }
  visitGroupingExpr(expr: Grouping): void {
    throw new Error("Method not implemented.");
  }
  visitLiteralExpr(expr: Literal): void {
    throw new Error("Method not implemented.");
  }
  visitLogicalExpr(expr: Logical): void {
    throw new Error("Method not implemented.");
  }
  visitCallExpr(expr: Call): void {
    throw new Error("Method not implemented.");
  }
  visitPrintStatement(stmt: Print): void {
    throw new Error("Method not implemented.");
  }
  visitWhileStatement(stmt: While): void {
    throw new Error("Method not implemented.");
  }
  visitReturnStatement(stmt: Return): void {
    throw new Error("Method not implemented.");
  }

  visitBlockStatement(stmt: Block): void {
    this.beginScope();
    this.resolve(stmt.statements);
    this.endScope();
  }

  visitVarStatement(stmt: Var): void {
    this.declare(stmt.name);

    if (stmt.initializer !== null) {
      this.resolveSingleExpression(stmt.initializer);
    }

    this.define(stmt.name);
  }

  visitVariableExpr(expr: Variable): void {
    if (
      !this.scopes.isEmpty() &&
      this.scopes.peek()![expr.name.lexeme] === false
    ) {
      Lox.errorWithToken(
        expr.name,
        "Can't read local variable in its own initializer."
      );
    }
    this.resolveLocal(expr, expr.name);
  }

  visitAssignExpr(expr: Assign): void {
    this.resolveSingleExpression(expr.value);
    this.resolveLocal(expr, expr.name);
  }

  visitFunctionStatement(stmt: Function): void {
    this.declare(stmt.name);
    this.define(stmt.name);
    this.resolveFunction(stmt, FunctionType.FUNCTION);
  }

  visitExpressionStatement(stmt: Expr): void {
    this.resolveSingleExpression(stmt.expression);
  }

  visitIfStatement(stmt: If): void {
    this.resolve;
  }

  resolveFunction(func: Function, type: FunctionType) {
    const prevFunc = this.currentFunc;

    this.currentFunc = type;
    this.beginScope();
    func.params.forEach((p: Token) => {
      this.declare(p);
      this.define(p);
    });

    this.resolve(func.body);
    this.endScope();
    this.currentFunc = prevFunc;
  }
  resolveLocal(expr: Expression, name: Token) {
    let finished = false;
    this.scopes.forEach((scope, i) => {
      if (finished) return;

      if (scope[name.lexeme] !== undefined) {
        this.interpreter.resolve(
          name.toString(),
          expr,
          this.scopes.length() - 1 - i
        );
        finished = true;
      }
    });
  }

  declare(name: Token) {
    if (this.scopes.isEmpty()) return;
    const scope = this.scopes.peek();

    if (scope[name.lexeme] !== undefined) {
      Lox.errorWithToken(
        name,
        "Already variable with this name in this scope."
      );
    }
    scope[name.lexeme] = false;
  }

  define(name: Token) {
    if (this.scopes.isEmpty()) return;
    const scope = this.scopes.peek();
    scope[name.lexeme] = true;
  }

  resolve(stmts: Statement[]) {
    stmts.forEach((s) => this.resolveSingleStatement(s));
  }

  resolveSingleStatement(stmt: Statement) {
    stmt.accept(this);
  }

  resolveSingleExpression(expr: Expression) {
    expr.accept(this);
  }

  beginScope() {
    this.scopes.push({});
  }

  endScope() {
    this.scopes.pop();
  }
}
