import { InputSourceFactory, type InputSource } from "./io";
import Lox from "./lox";

const VERSION = "1";

function executeFileCommands(lox: Lox, filename: string) {
  const inputSource: InputSource =
    InputSourceFactory.createFileInputSource(filename);

  const input = inputSource.getInput();
  input && lox.run(input);
}

function executeCliCommand(lox: Lox) {
  const inputSource: InputSource = InputSourceFactory.createCliInputSource();

  while (true) {
    const input = inputSource.getInput();
    if (!input) {
      break;
    }
    lox.run(input);
  }
}

function runLox() {
  const filename = process.argv.length >= 3 ? process.argv[2] : null;
  const lox: Lox = new Lox();
  if (filename) {
    executeFileCommands(lox, filename);
  } else {
    executeCliCommand(lox);
  }
}

console.log(`lox.ts ${VERSION}`);
runLox();
