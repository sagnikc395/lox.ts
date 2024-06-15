import type { Token } from "./Token";

export type Expr =
  | BinaryExpr
  | GroupingExpr
  | LiteralExpr
  | UnaryExpr
  | VariableExpr
  | AssignExpr
  | LogicalExpr
  | CallExpr
  | GetExpr
  | SetExpr
  | ThisExpr
  | SuperExpr;

// ast implemented using tagged unions
export type BinaryExpr = {
  type: "BinaryExpr";
  left: Expr;
  operator: Token;
  right: Expr;
};
export type GroupingExpr = { type: "GroupingExpr"; expression: Expr };
export type CallExpr = {
  type: "CallExpr";
  callee: Expr;
  paren: Token;
  arguments: Expr[];
};
export type LiteralExpr = { type: "LiteralExpr"; value: any };
export type LogicalExpr = {
  type: "LogicalExpr";
  left: Expr;
  operator: Token;
  right: Expr;
};
export type UnaryExpr = { type: "UnaryExpr"; operator: Token; right: Expr };
export type VariableExpr = { type: "VariableExpr"; name: Token };
export type AssignExpr = { type: "AssignExpr"; name: Token; value: Expr };
export type GetExpr = { type: "GetExpr"; name: Token; object: Expr };
export type SetExpr = {
  type: "SetExpr";
  object: Expr;
  name: Token;
  value: Expr;
};
export type ThisExpr = { type: "ThisExpr"; keyword: Token };
export type SuperExpr = { type: "SuperExpr"; keyword: Token; method: Token };

//stmt are just tagged unions
export type Stmt =
  | ExpressionStmt
  | PrintStmt
  | VarStmt
  | BlockStmt
  | IfStmt
  | WhileStmt
  | FunctionStmt
  | ReturnStmt
  | ClassStmt;

//define the statements
export type ExpressionStmt = {
  type: "ExpressionStmt";
  expression: Expr;
};

export type PrintStmt = {
  type: "PrintStmt";
  expression: Expr;
};

export type ClassStmt = {
  type: "ClassStmt";
  name: Token;
  superclass: VariableExpr | null;
  methods: Array<FunctionStmt>;
};

export type VarStmt = {
  type: "VarStmt";
  name: Token;
  intializer: Expr | null;
};

export type BlockStmt = {
  type: "BlockStmt";
  statements: Array<Stmt>;
};
export type IfStmt = {
  type: "IfStmt";
  condition: Expr;
  thenBranch: Stmt;
  elseBranch: Stmt | null;
};
export type WhileStmt = {
  type: "WhileStmt";
  condition: Expr;
  body: Stmt;
};
export type FunctionStmt = {
  type: "FunctionStmt";
  name: Token;
  params: Token[];
  body: Stmt[];
};

export type ReturnStmt = {
  type: "ReturnStmt";
  keyword: Token;
  value: Expr | null;
};
