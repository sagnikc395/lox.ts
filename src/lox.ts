import type { RuntimeError } from "./runtime-error";
import Scanner from "./scanner";
import type Token from "./token";
import TokenType from "./tokentype";

class Lox {
  static hadError: boolean = false;
  static hadRuntimeError = false;

  static main(args: string[]) {
    try {
      if (args.length > 1) {
        console.log(`Usage: lox.ts [script]`);
        process.exit(64);
      } else if (args.length === 1) {
        Lox.runFile(args[0]);
      } else {
        Lox.runPrompt();
      }
    } catch (err) {
      throw new Error("Unknown Error: main method exited!");
    }
  }
  private static async runFile(path: string) {
    try {
      const file = Bun.file(path);
      const buffer = await file.arrayBuffer();
      const bytes = new Int8Array(buffer);
      Lox.run(new String(bytes).toString());

      // error in the exit code
      if (this.hadError) {
        process.exit(65);
      }
    } catch (err) {
      throw new Error("Unknown Error: runFile method exited!");
    }
  }

  private static async runPrompt() {
    try {
      while (true) {
        const prompt = "> ";
        process.stdout.write(prompt);
        for await (const line of console) {
          if (line === null) {
            break;
          }
          //else run this command
          Lox.run(line);
          this.hadError = false;
        }
      }
    } catch (err) {
      throw new Error("Unknwon Error: runPrompt method exited!");
    }
  }

  private static run(source: string) {
    const scanner = new Scanner(source);
    const tokens: Array<Token> = scanner.scanTokens();

    for (const token of tokens) {
      console.log(token);
    }
  }
  static runtimeError(error: RuntimeError) {
    console.log(error.message + `\n[line ${error.token.line}]`);
    Lox.hadRuntimeError = true;
  }

  static error(line: number, message: string) {
    Lox.report(line, "", message);
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where} : ${message}`);
    this.hadError = true;
  }

  static errorWithToken(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.report(token.line, " at end", message);
    } else {
      this.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }
}

export default Lox;
