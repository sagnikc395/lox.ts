import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Resolver } from "./resolver";
import type { RuntimeError } from "./runtime-error";
import Scanner from "./scanner";
import type Token from "./token";
import TokenType from "./tokentype";

export class Lox {
  static hadError: boolean = false;
  static hadRuntimeError = false;
  static interpreter = new Interpreter();

  public run(input: string) {
    if (input) {
      const scanner = new Scanner(input);
      const tokens = scanner.scanTokens();
      const parser = new Parser(tokens);
      const stmts = parser.parse()!;
      if (Lox.hadError) process.exit(65);
      if (Lox.hadRuntimeError) process.exit(70);

      const resolver = new Resolver(Lox.interpreter);
      resolver.resolve(stmts);

      if (Lox.hadError) process.exit(65);

      Lox.interpreter.interpret(stmts);
    }
  }

  static runtimeError(error: RuntimeError) {
    console.log(error.message + `\n[line ${error.token.line}]`);
    Lox.hadRuntimeError = true;
  }
  static error(line: number, message: string) {
    this.report(line, "", message);
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}`);
    this.hadError = true;
  }

  static errorWithToken(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.report(token.line, " at end", message);
    } else {
      this.report(token.line, ` at '${token.lexeme}'`, message);
    }
  }
}
