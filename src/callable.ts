import { Environment } from "./environment";
import type { Interpreter } from "./interpreter";
import type { LiteralValue } from "./tokentype";
import { Function } from "./statement";

export enum FunctionType {
  //different types of functions that are posible
  NONE,
  FUNCTION,
}

export interface Callable {
  // different methods for the callable interface
  arity(): number;
  call(interpreter: Interpreter, args: LiteralValue[]): LiteralValue;
}

export class CallableFunc implements Callable {
  closure: Environment;
  declaration: Function;

  constructor(declaration: Function, closure: Environment) {
    this.closure = closure;
    this.declaration = declaration;
  }

  arity(): number {
    return this.declaration.params.length;
  }

  call(interpreter: Interpreter, args: unknown[]): unknown {
    const env = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      env.define(this.declaration.params[i]!.lexeme, args[i]);
    }
    try {
    } catch (error) {
      const err = error as Return;
      return err.value;
    }
    return null;
  }
}
