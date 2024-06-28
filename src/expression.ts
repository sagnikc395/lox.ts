import type Token from "./token";
import type { LiteralValue } from "./tokentype";

export abstract class Expr {
  static Right: any;
  abstract accept<T>(visitor: ExpressionVisitor<T>): T;
}

export interface ExpressionVisitor<T> {
  visitBinaryExpr(expr: Binary): T;
  visitUnaryExpr(expr: Unary): T;
  visitGroupingExpr(expr: Grouping): T;
  visitLiteralExpr(expr: Literal): T;
  visitVariableExpr(expr: Variable): T;
  visitAssignExpr(expr: Assign): T;
  visitLogicalExpr(expr: Logical): T;
  visitCallExpr(expr: Call): T;
}
export class Assign extends Expr {
  name: Token;
  value: Expr;

  constructor(name: Token, value: Expr) {
    super();
    this.name = name;
    this.value = value;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
}

export class Variable extends Expr {
  name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}

export class Binary extends Expr {
  left: Expr;
  right: Expr;
  operator: Token;

  constructor(left: Expr, right: Expr, operator: Token) {
    super();
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class Call extends Expr {
  paren: Token;
  callee: Expr;
  arguments: Array<Expr>;

  constructor(paren: Token, callee: Expr, args: Expr[]) {
    super();
    this.paren = paren;
    this.callee = callee;
    this.arguments = args;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitCallExpr(this);
  }
}

export class Unary extends Expr {
  right: Expr;
  operator: Token;

  constructor(right: Expr, operator: Token) {
    super();
    this.right = right;
    this.operator = operator;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}

export class Grouping extends Expr {
  expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}

export class Literal extends Expr {
  value: LiteralValue;

  constructor(value: LiteralValue) {
    super();
    this.value = value;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class Logical extends Expr {
  left: Expr;
  right: Expr;
  operator: Token;

  constructor(left: Expr, right: Expr, operator: Token) {
    super();
    this.left = left;
    this.right = right;
    this.operator = operator;
  }

  accept<T>(visitor: ExpressionVisitor<T>): T {
    return visitor.visitLogicalExpr(this);
  }
}
