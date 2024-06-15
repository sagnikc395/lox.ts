import type { Expr } from "./AST";
import { Lox } from "./lox";
import type { Token } from "./Token";
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

  private (...types: Array<TokenType>): boolean {
    for(const typE of types) {
        if(this.check(typE)){
            this.advance();
            return true;
        }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if(this.isAtEnd()) {
        return false;
    }
    return this.peek().type == type;
  }
}
