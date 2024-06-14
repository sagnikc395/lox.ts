import type { Token } from "./Token";

class Parser {
  private tokens: Array<Token>;
  private current: number = 0;


  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    
  }

}
