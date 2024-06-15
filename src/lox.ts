import { Parser } from "./Parser";
import { Scanner } from "./Scanner";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Lox {
  static hadError: boolean = false;
  public static main() {
    const args = process.argv;
    if (args.length > 1) {
      console.log("Usage: lox.ts [script]");
      process.exit(64);
    } else if (args.length === 1) {
      Lox.runFile(args[0]);
    } else {
      Lox.runPrompt();
    }
  }
  private static async runFile(path: string) {
    const file = Bun.file(path);
    const bytes = await file.arrayBuffer();
    Lox.runFile(String(bytes));
    if (this.hadError) {
      process.exit(65);
    }
  }

  private static async runPrompt() {
    const prompt = "> ";
    process.stdout.write(prompt);
    for await (const line of console) {
      if (line == null) {
        break;
      }
      Lox.run(line);
      this.hadError = false;
    }
  }

  private static run(source: string) {
    const scanner = new Scanner(source);
    const tokens: Array<Token> = scanner.scanTokens();
    const parser = new Parser(tokens);

    const statements = parser.parse();

    //print the tokens
    for (const token of tokens) {
      console.log(token);
    }
  }

  static Error(line: number, message: string) {
    Lox.report(line, "", message);
  }

  static tokenError(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      Lox.report(token.line, " at end", message);
    }
    Lox.report(
      token.line,
      "",
      `${token.line} at ' ${token.lexeme} ' ${message}`
    );
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}`);
    this.hadError = true;
  }
}

//start
Lox.main();
