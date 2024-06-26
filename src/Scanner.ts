import Token from "./token";
import TokenType from "./tokentype";

class Scanner {
  source: string = "";
  tokens: Array<Token> = new Array<Token>();
  line: number = 1;
  start: number = 0;
  current: number = 0;

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Array<Token> {
    while (!isAtEnd()) {
      this.start = this.current;
      scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", {}, this.line));
    return this.tokens;
  }

  private isAtEnd(): boolean {
    //to check if we have consumed all the characters or not
    return this.current >= this.source.length;
  }

  private;
}

export default Scanner;
