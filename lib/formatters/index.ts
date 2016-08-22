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

import {
  updateWithNode,
  updateWithLineAndCharacter,
} from "../helpers/updater";
import * as orderedImports from "./ordered-imports";
import * as quotemark from "./quotemark";

export interface Context {
  formatters: any;
  orderedImports?: orderedImports.Context;
}

export const layers = [
  {
    // "no-unused-variable': {
    //   priority: 1.0,
    //   format: (sourceFile, ruleFailure) => {
    //     const node = findNode(sourceFile, ruleFailure)
    //     const target = node.parent
    //     const start = target.getFullStart()
    //     let end = target.getEnd()
    //     const parent = target.parent
    //     console.log(node.kind, target.kind, parent.kind, punctuationPart(node.kind))
    //     const post = parent.getFullText().substring(end - parent.getFullStart())
    //     const matched = post.match(/^\s*[,;]/)
    //     if (matched != null) {
    //       end = end + matched[0].length
    //     }
    //     return updateText(sourceFile, start, end, '')
    //   }
    // },

    "ordered-imports": {
      priority: 0.0,
      format: orderedImports.format,
    },
  },

  {
    "quotemark": {
      priority: 1.0,
      format: quotemark.format,
    },

    "semicolon": {
      priority: 0.5,
      format: (sourceFile: SourceFile, ruleFailure: RuleFailure, context: Context) => {
        return updateWithNode(sourceFile, ruleFailure, (node) => {
          const oldText = node.getFullText();
          return `${oldText};`;
        });
      },
    },

    "trailing-comma": {
      priority: 0.5,
      format: (sourceFile: SourceFile, ruleFailure: RuleFailure) => {
        return updateWithNode(sourceFile, ruleFailure, (node) => {
          const oldText = node.getFullText();
          return `${oldText},`;
        });
      },
    },
  },

  {
    "no-consecutive-blank-lines": {
      priority: 0.2,
      format: (sourceFile: SourceFile, ruleFailure: RuleFailure, context: Context) => {
        return updateWithLineAndCharacter(sourceFile, ruleFailure, (text) => {
          return text.replace(/\n+/, "");
        });
      },
    },
  },

];