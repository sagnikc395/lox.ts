import type { Token } from "./Token";
import { TokenType } from "./TokenType";

type Expr = {};

class Parser {
  private tokens: Array<Token>;
  private current: number = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    return this.equality();
  }

  private equality(): Expr {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.BANG_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Expr.Binary(expr, operator, right);
    }
    return expr;
  }

  private match(...types: TokenType[]): boolean {
    for (const tokentype of types) {
      if (this.check(tokentype)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  private check(tokentype: TokenType): boolean {
    if(this.isAtEnd()) {
        return false;
    }
    return typeof this.peek() === tokentype;
  }
}
