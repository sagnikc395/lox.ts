import { RuntimeError } from "./runtime-error";
import type Token from "./token";
import type { LiteralValue } from "./tokentype";

export class Environment {
  enclosing: Environment | null;
  values: Record<string, LiteralValue>;

  constructor(enclosing?: Environment) {
    this.values = {};
    this.enclosing = enclosing || null;
  }

  define(name: string, value: LiteralValue) {
    this.values[name] = value;
  }

  assign(name: Token, value: LiteralValue) {
    const currValue = this.values[name.lexeme];
    if (currValue !== undefined) {
      this.values[name.lexeme] = value;
      return;
    }
    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new RuntimeError(name, `Undefined Variabale '${name.lexeme}'.`);
  }

  get(name: Token) {
    const currValue = this.values[name.lexeme];
    if (currValue !== undefined) {
      return currValue;
    }
    if (this.enclosing) {
      const value = this.enclosing.get(name) as unknown;
      return value;
    }
    throw new RuntimeError(name, `Undefined Variable`);
  }

  ancestor(depth: number) {
    //get the context using the this context
    let env: Environment | null | undefined = this;

    for (let i = 0; i < depth; i++) {
      env = env?.enclosing;
    }
    return env;
  }

  getAt(depth: number, name: string) {
    return this.ancestor(depth)!.values[name];
  }

  assignAt(depth: number, name: Token, value: LiteralValue) {
    this.ancestor(depth)!.values[name.lexeme] = value;
  }
}
