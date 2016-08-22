import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  Node,
  SourceFile,
} from "typescript";

import {findNode} from "./finder";
import {getPositionFromLineAndCharacter} from "./position";

export function updateWithNode(sourceFile: SourceFile, ruleFailure: RuleFailure, cb: (node: Node) => string) {
  const node = findNode(sourceFile, ruleFailure);
  const newText = cb(node);
  return updateText(sourceFile, node.getFullStart(), node.getEnd(), newText);
}

export function updateWithText(sourceFile: SourceFile, ruleFailure: RuleFailure, cb: (oldText: string) => string) {
  const fullText = sourceFile.getFullText();
  const start = ruleFailure.getStartPosition().getPosition();
  const end = ruleFailure.getEndPosition().getPosition();
  const newText = cb(fullText.substring(start, end));
  return updateText(sourceFile, start, end, newText);
}

export function updateWithLineAndCharacter(
  sourceFile: SourceFile,
  ruleFailure: RuleFailure,
  cb: (oldText: string) => string
) {
  const fullText = sourceFile.getFullText();
  const start = getPositionFromLineAndCharacter(sourceFile, ruleFailure.getStartPosition().getLineAndCharacter());
  const end = getPositionFromLineAndCharacter(sourceFile, ruleFailure.getEndPosition().getLineAndCharacter());
  const newText = cb(fullText.substring(start, end));
  return updateText(sourceFile, start, end, newText);
}

export function updateText(sourceFile: SourceFile, start: number, end: number, newText: string) {
  const fullText = sourceFile.getFullText();
  const pre = fullText.substring(0, start);
  const post = fullText.substring(end);
  return sourceFile.update(`${pre}${newText}${post}`, {
    newLength: newText.length,
    span: {
      start,
      length: end - start,
    },
  });
}
