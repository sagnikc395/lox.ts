import { Expr } from "./expression";
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
}
