import type TokenType from "./tokentype";

class Token {
  type: TokenType;
  lexeme: string;
  literal: Object;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: Object, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
    this.literal = literal;
  }

  public toString(): string {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}

export default Token;
