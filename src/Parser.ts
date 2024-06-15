import type { Expr, Stmt } from "./AST";
import { Lox } from "./lox";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Parser {
  private tokens: Array<Token>;
  private current: number = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    return this.assignment();
  }

  private assignment(): Expr {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (exp.type === "VariableExpr") {
        const name = expr.name;
        return {
          type: "AssignExpr",
          name,
          value,
        };
      } else if (expr.type === "GetExpr") {
        return {
          type: "SetExpr",
          object: expr.object,
          name: expr.name,
          value,
        };
      }
      Lox.Error(equals, "Invalid assignment target.");
    }
    return expr;
  }

  private or(): Expr {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = {
        type: "LogicalExpr",
        left: expr,
        operator,
        right,
      };
    }
    return expr;
  }

  private and(): Expr {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = {
        type: "LogicalExpr",
        left: expr,
        operator,
        right,
      };
    }
    return expr;
  }

  private equality(): Expr {
    let expr = this.comparision();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparision();
      expr = {
        type: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }
    return expr;
  }

  private statement(): Stmt {
    return this.expressionStatement();
  }

  private expressionStatement(): Stmt {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after expression.");
    return {
      type: "ExpressionStmt",
      expression: expr,
    };
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }
    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string): Error {
    Lox.tokenError(token, message);
    return new Error();
  }

  private synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) {
        return;
      }
      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }
      this.advance();
    }
  }

  private comparision(): Expr {
    let expr = this.addition();
    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator = this.previous();
      const right = this.addition();

      expr = {
        type: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }

    return expr;
  }

  private match(...types: Array<TokenType>): boolean {
    for (const typE of types) {
      if (this.check(typE)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    return this.peek().type == type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
