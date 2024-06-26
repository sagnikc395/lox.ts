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

  scanToken(): Array<Token> {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanTokens();
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
        this.addToken(
          this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG,
          null
        );
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
          null
        );
        break;
      case "<":
        this.addToken(
          this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS,
          null
        );
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER,
          null
        );
        break;
      case "/":
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH, null);
        }
        break;

      case " ":
      case "\r":
      case "\t":
        //ignoring the whitespace
        break;

      case "\n":
        this.line++;
        break;

      case '"':
        this.string();
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

  private peek(): string {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.source.charAt(this.current);
  }

  private string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") this.line++;
      this.advance();
    }
    if (this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string.");
      return;
    }
    //closing .
    this.advance();
    //trim the surrounding quotes

    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }
}

export default Scanner;
