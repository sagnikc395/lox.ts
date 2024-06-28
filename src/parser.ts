import { Binary, Call, Expr, Literal, Unary, Variable } from "./expression";
import Lox from "./lox";
import Token from "./token";
import TokenType from "./tokentype";

export class Parser {
  private tokens: Array<Token>;
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.current = 0;
  }

  private check(type: TokenType) {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  private advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  private peek() {
    return this.tokens[this.current] as Token;
  }

  private previous() {
    return this.tokens[this.current - 1] as Token;
  }

  private match(...types: TokenType[]) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

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

  private equality(): Expr {
    let expr = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, right, operator);
    }
    return expr;
  }

  private expression(): Expr {
    return this.equality();
  }

  private comparison(): Expr {
    let expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, right, operator);
    }
    return expr;
  }

  private term(): Expr {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, right, operator);
    }
    return expr;
  }

  private factor(): Expr {
    let expr = this.unary();
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, right, operator);
    }
    return expr;
  }

  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(right, operator);
    }
    return this.call();
  }

  private call(): Expr {
    let expr = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else break;
    }
    return expr;
  }

  private finishCall(callee: Expr) {
    const args: Expr[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length > 255) {
          this.error(this.peek(), "Can't have more than 255 arguments!");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    const paren = this.consume(
      TokenType.RIGHT_PAREN,
      "Expect ')' after arguments."
    );

    return new Call(paren, callee, args);
  }

  private primary(): Expr {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);
    if (this.match(TokenType.NUMBER, TokenType.STRING))
      return new Literal(this.previous().literal);
    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, `Expect ")" after expression.`);
      return new Grouping(expr);
    }

    throw this.error(this.peek(), "Expect expression.");
  }
  private consume(type: TokenType, message: string) {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string) {
    Lox.errorWithToken(token, message);
    return new ParserError();
  }
}
