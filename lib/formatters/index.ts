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
import * as semicolon from "./semicolon";
import * as trailingComma from "./trailing-comma";
import * as noConsecutiveBlankLines from './no-consecutive-blank-lines'
import * as noUnusedVariable from './no-unused-variable'

export interface Context {
  formatters: any;
  orderedImports?: orderedImports.Context;
}

export const layers = [
  {
    // "no-unused-variable": {
    //   priority: 1.0,
    //   format: noUnusedVariable.format,
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
      format: semicolon.format,
    },

    "trailing-comma": {
      priority: 0.5,
      format: trailingComma.format,
    },
  },

  {
    "no-consecutive-blank-lines": {
      priority: 0.2,
      format: noConsecutiveBlankLines.format,
    },
  },

];