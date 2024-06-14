class GenerateAST {
  static main() {
    const args = process.argv;
    if (args.length !== 1) {
      console.error("Usage: generate_ast <output_directory>");
      process.exit(64);
    }

    const outpurDir = args[0];
    this.defineAST(
      outpurDir,
      "Expr",
      new Array<string>(
        "Binary   : Expr left, Token operator, Expr right",
        "Grouping : Expr expression",
        "Literal  : Object value",
        "Unary    : Token operator, Expr right"
      )
    );
  }
  private static defineAST(
    outpurDir: string,
    baseName: string,
    types: Array<string>
  ) {
    throw new Error("Method not implemented.");
  }

  private static defineVisitor(baseName: string, types: Array<string>) {

    throw new Error("Method not implemented");
  }

  
}

GenerateAST.main();
