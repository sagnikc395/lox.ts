import fs from "fs";
import reader from "readline-sync";

export type InputSourceType = "file" | "cli";

export interface InputSource {
  getInput(): string | undefined;
}

export class InputSourceFactory {
  static createFileInputSource(source: string): FileInputSource {
    return new FileInputSource(source);
  }

  static createCliInputSource(): InputSource {
    return new CliInputSource();
  }
}

class FileInputSource implements InputSource {
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  getInput() {
    console.log(`\nInterpreting file: ${this.source}\n`);
    try {
      return fs.readFileSync(this.source, "utf8");
    } catch (error) {
      console.log(error);
      console.log(`Unable to read file: ${this.source}`);
      return undefined;
    }
  }
}

class CliInputSource implements InputSource {
  getInput() {
    let input = reader.question("> ");
    if (input === "exit") {
      console.log("Good bye:)");
      return undefined;
    }
    return input;
  }
}
