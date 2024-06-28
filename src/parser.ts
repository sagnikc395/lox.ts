import Token from "./token";
import TokenType from "./tokentype";

class Parser {
  private tokens: Array<Token>;
  private count: number = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    return this.equality();
  }

  private equality(): Expr {
    const expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
    }
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
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
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type == TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[current];
  }

  private previous(): Token {
    return this.tokens[current - 1];
  }

  private comparision(): Expr {
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
      expr = new Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private term(): Expr {
    let expr = factor();
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = factor();
      expr = new Expr.Right(expr, operator, right);
    }
    return expr;
  }

  
}

export default Parser;
