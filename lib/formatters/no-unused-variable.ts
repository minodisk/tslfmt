import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  SourceFile,
  SyntaxKind,
  forEachChild,
  VariableStatement,
  Node,
} from "typescript";

import {
  getSyntaxKindName,
  forEachNode,
  walk,
} from "../helpers/finder";
import Range from "../helpers/range";
import { updateText } from "../helpers/updater";
import { Context } from "./index";

export function format(sourceFile: SourceFile, ruleFailure: RuleFailure, context: Context) {
  const rangeFailure = Range.createWithRuleFailure(ruleFailure);

  forEachNode(sourceFile, (node) => {
    if (node.kind !== SyntaxKind.VariableStatement) {
      return true;
    }

    const rangeNode = Range.createWithNode(node);
    if (!rangeNode.contains(rangeFailure)) {
      return false;
    }

    const statement = node as VariableStatement;
    const children: Node[] = [];
    let hasIdentifier = false;
    statement.declarationList.declarations.forEach((dec) => {
      dec.getChildren().forEach((child) => {
        const rangeChild = Range.createWithNode(child);
        if (rangeChild.equals(rangeFailure)) {
          return;
        }
        if (child.kind === SyntaxKind.Identifier) {
          hasIdentifier = true;
          children.push(child);
        } else {
          for (let i = 1; i <= 2; i++) {
            const c = children[children.length - i];
            if (c == null) break;
            if (c.kind === SyntaxKind.Identifier) {
              children.push(child);
              break;
            }
          }
        }
      });
    });

    if (!hasIdentifier) {
      sourceFile = updateText(sourceFile, node.getFullStart(), rangeNode.end, "");
      return false;
    }

    walk(statement, 0, (node, depth) => {
      switch (node.kind) {
        case SyntaxKind.LetKeyword:
        case SyntaxKind.VarKeyword:
        case SyntaxKind.ConstKeyword:
          children.unshift(node);
          break;
        case SyntaxKind.SemicolonToken:
          children.push(node);
          break;
      }
      return true;
    })
    const newText = children.map((child) => child.getFullText()).join('')
    sourceFile = updateText(sourceFile, statement.getFullStart(), rangeNode.end, newText)

    return false;
  })
  // const target = node.parent
  // const start = target.getFullStart()
  // let end = target.getEnd()
  // const parent = target.parent
  // console.log(node.kind, target.kind, parent.kind, punctuationPart(node.kind))
  // const post = parent.getFullText().substring(end - parent.getFullStart())
  // const matched = post.match(/^\s*[,;]/)
  // if (matched != null) {
  //   end = end + matched[0].length
  // }
  // return updateText(sourceFile, start, end, '')
  return sourceFile;
}
