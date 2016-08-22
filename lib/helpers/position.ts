import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  SyntaxKind,
  Node,
  ScriptTarget,
  SourceFile,
  createSourceFile,
  forEachChild,
  LineAndCharacter,
} from "typescript";

export function getPositionFromLine(sourceFile: SourceFile, line: number) {
  const starts = sourceFile.getLineStarts();
  return starts[line];
}

export function getPositionFromLineAndCharacter(sourceFile: SourceFile, {line, character}: LineAndCharacter) {
  const starts = sourceFile.getLineStarts();
  const start = starts[line];
  return start + character;
}
