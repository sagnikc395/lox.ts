import Lox from "./lox";

const args = Bun.argv;
try {
  Lox.main(args);
} catch (err) {
  console.log(err);
}
