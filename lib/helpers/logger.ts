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

export function warn(ruleFailure: RuleFailure, text: string) {
  console.warn(`[tslfmt]`, `  ${text} ${ruleFailure.getRuleName()} (${ruleFailure.getFailure()})`);
}

export function toPosString({line, character}: LineAndCharacter) {
  return `[${line}:${character}]`;
}
