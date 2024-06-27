import { join } from "path";
import { write } from "bun";

class GenerateAST {
  static main(args: string[]) {
    if (args.length !== 3) {
      console.error(`Usage: bun run genast.ts <output directory>`);
      process.exit(64);
    }
    const outputDir = args[2];
    GenerateAST.defineAST(
      outputDir,
      "Expr",
      Array.of(
        "Binary     : Expr left, Token operator, Expr right",
        "Grouping   : Expr expression",
        "Literal    : Object value",
        "Unary      : Token operator, Expr right"
      )
    );
  }

  static async defineAST(
    outputdir: string,
    basename: string,
    types: Array<string>
  ) {
    const fpath = join(outputdir, `${basename}.ts`);
    let content = "";

    //add imports
    content += `import {Token} from "./token";\n\n`;

    //begin abstract class defn
    content += `export asbtract class ${basename} {\n`;

    // visitor interface
    content += this.defineVisitor(basename, types);
    // The base accept() method
    content += `  abstract accept<R>(visitor: Visitor<R>): R;\n`;

    // Close the base class
    content += `}\n\n`;

    // AST classes
    for (const type of types) {
      const className = type.split(":")[0].trim();
      const fields = type.split(":")[1].trim();
      content += this.defineType(basename, className, fields);
    }

    // Write the file using Bun's write function
    await write(fpath, content);
  }

  private static defineVisitor(baseName: string, types: string[]): string {
    let content = `  interface Visitor<R> {\n`;

    for (const type of types) {
      const typeName = type.split(":")[0].trim();
      content += `    visit${typeName}${baseName}(${baseName.toLowerCase()} : ${typeName}); R;\n`;
    }
    content += ` }\n\n`;
    return content;
  }
  private static defineType(
    baseName: string,
    className: string,
    fieldList: string
  ): string {
    let content = `export class ${className} extends ${baseName} {\n`;

    // Constructor
    content += `  constructor(\n`;
    const fields = fieldList.split(", ");
    for (const field of fields) {
      const [type, name] = field.split(" ");
      content += `    public readonly ${name}: ${type},\n`;
    }
    content += `  ) {\n    super();\n  }\n\n`;

    // Visitor pattern
    content += `  accept<R>(visitor: Visitor<R>): R {\n`;
    content += `    return visitor.visit${className}${baseName}(this);\n`;
    content += `  }\n`;

    content += `}\n\n`;
    return content;
  }
}

GenerateAST.main(process.argv);
