import type { Expr, FunctionStmt, Stmt, VariableExpr } from "./AST";
import { Lox } from "./lox";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Parser {
  private tokens: Array<Token>;
  private current: number = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  private parse(): Array<Stmt> {
    const statements: Array<Stmt> = [];
    while (!this.isAtEnd()) {
      const result = this.declaration();
      if (result) {
        statements.push(result);
      }
    }
    return statements;
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

  private or(): Expr {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = {
        type: "LogicalExpr",
        left: expr,
        operator,
        right,
      };
    }
    return expr;
  }

  private and(): Expr {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = {
        type: "LogicalExpr",
        left: expr,
        operator,
        right,
      };
    }
    return expr;
  }

  private declaration(): Stmt | null {
    try {
      if (this.match(TokenType.CLASS)) return this.classDeclaration();
      if (this.match(TokenType.FUN))
        return this.functionDeclaration("function");
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
    } catch (e) {
      this.synchronize();
      return null;
    }
  }
  private classDeclaration(): Stmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expect class name.");

    let superclass: VariableExpr | null = null;

    if (this.match(TokenType.LESS)) {
      this.consume(TokenType.IDENTIFIER, "Expect superclass name.");
      superclass = { type: "VariableExpr", name: this.previous() };
    }

    this.consume(TokenType.LEFT_BRACE, "Expect '{' before class body.");

    const methods = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      methods.push(this.functionDeclaration("method"));
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after class body.");

    return { type: "ClassStmt", methods, name, superclass };
  }
  private functionDeclaration(kind: string): FunctionStmt {
    const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
    this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);
    const parameters: Token[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          this.error(this.peek(), "cannot have more than 255 parameters");
        }

        parameters.push(
          this.consume(TokenType.IDENTIFIER, "Expect parameter name.")
        );
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");

    this.consume(TokenType.LEFT_BRACE, "Expect '{' before " + kind + " body.");
    const body = this.block();
    return { type: "FunctionStmt", name, params: parameters, body };
  }

  private varDeclaration(): Stmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");
    let initializer = this.match(TokenType.EQUAL) ? this.expression() : null;

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");

    return { type: "VarStmt", name, initializer };
  }

  private equality(): Expr {
    let expr = this.comparision();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparision();
      expr = {
        type: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }
    return expr;
  }

  private statement(): Stmt {
    return this.expressionStatement();
  }

  private returnStatement(): Stmt {
    const keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after return value");

    return { type: "ReturnStmt", keyword, value };
  }

  private forStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

    let initializer = null;
    if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition: Expr | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Exprect ';' after loop condition.");

    let increment;

    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

    let body = this.statement();

    if (increment) {
      body = {
        type: "BlockStmt",
        statements: [body, { type: "ExpressionStmt", expression: increment }],
      };
    }

    if (!condition) condition = { type: "LiteralExpr", value: true };
    body = { type: "WhileStmt", condition, body };

    if (initializer) {
      body = { type: "BlockStmt", statements: [initializer, body] };
    }

    return body;
  }

  private whileStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Exprect ')' after condition.");
    const body = this.statement();

    return { type: "WhileStmt", condition, body };
  }

  private ifStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after if.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");

    const thenBranch = this.statement();
    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return { type: "IfStmt", condition, thenBranch, elseBranch };
  }

  private printStatement(): Stmt {
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return { type: "PrintStmt", expression: value };
  }

  private expressionStatement(): Stmt {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after expression.");
    return {
      type: "ExpressionStmt",
      expression: expr,
    };
  }

  private block(): Array<Stmt> {
    const statements: Stmt[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const declaration = this.declaration();
      if (declaration) {
        statements.push(declaration);
      }
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }
    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string): Error {
    Lox.tokenError(token, message);
    return new Error();
  }

  private synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) {
        return;
      }
      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }
      this.advance();
    }
  }

  private comparision(): Expr {
    let expr = this.addition();
    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator = this.previous();
      const right = this.addition();

      expr = {
        type: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }

    return expr;
  }

  private match(...types: Array<TokenType>): boolean {
    for (const typE of types) {
      if (this.check(typE)) {
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
    return this.peek().type == type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private addition(): Expr {
    let expr = this.multiplication();
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.multiplication();
      expr = {
        type: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }
    return expr;
  }

  private multiplication(): Expr {
    let expr = this.unary();
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();
      expr = {
        type: "BinaryExpr",
        left: expr,
        operator,
        right,
      };
    }
    return expr;
  }

  
}
