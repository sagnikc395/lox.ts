import Lox from "./lox";
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

  private scanTokens() {
    const c = this.advance();
    switch (c) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN, null);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN, null);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE, null);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE, null);
        break;
      case ",":
        this.addToken(TokenType.COMMA, null);
        break;
      case ".":
        this.addToken(TokenType.DOT, null);
        break;
      case "-":
        this.addToken(TokenType.MINUS, null);
        break;
      case "+":
        this.addToken(TokenType.PLUS, null);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON, null);
        break;
      case "*":
        this.addToken(TokenType.STAR, null);
        break;
      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;

      default:
        Lox.error(this.line, "Unexpected character.");
        break;
    }
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private addToken(type: TokenType, literal: Object | null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal!, this.line));
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    if (this.source.charAt(this.current) !== expected) {
      return false;
    }
    this.current++;
    return true;
  }
}

export default Scanner;
