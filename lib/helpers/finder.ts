import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  Node,
  SourceFile,
  forEachChild,
  SyntaxKind,
} from "typescript";

import {toPosString, warn} from "./logger";

const SyntaxKindNames: string[] = (() => {
  const map: string[] = [];
  for (let key in SyntaxKind) {
    map[(SyntaxKind as any)[key]] = key
  }
  return map
})();

export function getSyntaxKindName(kind: number): string {
  return SyntaxKindNames[kind];
}

export function forEachNode(sourceFile: SourceFile, cb: (node: Node) => boolean) {
  let isContinue = true;
  forEachChild(sourceFile, (node) => {
    if (!isContinue) {
      return;
    }
    isContinue = isContinue && cb(node);
    if (!isContinue) {
      return;
    }
    isContinue = isContinue && walk(node, 0, cb);
  });
}

export function walk(node: Node, depth: number, cb: (node: Node, depth: number) => boolean): boolean {
  const children = node.getChildren();
  let isContinue = true;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    depth++;

    isContinue = isContinue && cb(child, depth);
    if (!isContinue) {
      return isContinue;
    }

    isContinue = walk(child, depth, cb);
    if (!isContinue) {
      return isContinue;
    }
  }
  return isContinue;
}

export function findNode(sourceFile: SourceFile, ruleFailure: RuleFailure): Node {
  const start = ruleFailure.getStartPosition().getPosition();
  const end = ruleFailure.getEndPosition().getPosition();
  let found: Node;
  forEachChild(sourceFile, (node) => {
    if (found != null) {
      return;
    }
    found = findChild(node, start, end);
  });

  if (found == null) {
    const s = toPosString(ruleFailure.getStartPosition().getLineAndCharacter());
    const e = toPosString(ruleFailure.getEndPosition().getLineAndCharacter());
    warn(ruleFailure, `can't find node from ${s} to ${e} for`);
  }

  return found;
}

export function findChild(node: Node, start: number, end: number): Node {
  if (!(node.getFullStart() <= start && end <= node.getEnd())) {
    return;
  }
  const children = node.getChildren();
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    let found = findChild(child, start, end);
    if (found != null) {
      return found;
    }
  }
  return node;
}
