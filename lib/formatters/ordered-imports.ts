import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  SyntaxKind,
  Node,
  ScriptTarget,
  SourceFile,
  ImportDeclaration,
  createSourceFile,
  forEachChild,
  LineAndCharacter,
} from "typescript";

import { updateText } from "../helpers/updater";
import { Context } from "./index";

export interface Context {
  done: boolean;
}

export function format(sourceFile: SourceFile, ruleFailure: RuleFailure, context: Context) {
  if (context.orderedImports == null) context.orderedImports = { done: false };
  const ctx = context.orderedImports;
  if (ctx.done) return sourceFile;
  ctx.done = true;

  interface Block {
    nodes: ImportDeclaration[];
    start?: number;
    end?: number;
  }

  const blocks: Block[] = [];
  let currentBlock: Block;
  let prev: Node;
  for (let i = 0; i < sourceFile.statements.length; i++) {
    const node = sourceFile.statements[i];
    if (node.kind !== SyntaxKind.ImportDeclaration) continue;

    if (
      prev == null ||
      prev.getEnd() !== node.getFullStart() ||
      /^\n{2,}/.test(node.getFullText())
    ) {
      currentBlock = { nodes: [] };
      blocks.push(currentBlock);
    }
    currentBlock.nodes.push(node as ImportDeclaration);
    prev = node;
  }

  blocks
    .map((block) => {
      let start = Number.MAX_VALUE;
      let end = 0;
      block.nodes.forEach((node) => {
        start = Math.min(start, node.getStart());
        end = Math.max(end, node.getEnd());
      });
      block.start = start;
      block.end = end;
      return block;
    })
    .forEach(({start, end, nodes}) => {
      const newText = nodes
        .sort((a, b) => {
          const aText = a.moduleSpecifier.getText();
          const bText = b.moduleSpecifier.getText();
          if (aText < bText) {
            return -1;
          }
          if (aText > bText) {
            return 1;
          }
          return 0;
        })
        .map((node) => node.getText())
        .join("\n");
      sourceFile = updateText(sourceFile, start, end, newText);
    });

  return sourceFile;
}
