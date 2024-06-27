import type Token from "./token";

class Parser {
  private tokens: Array<Token>;
  private count: number = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    return equality();
  }

  private equality(): Expr {
    const expr = comparison();
  }
}

export default Parser;
