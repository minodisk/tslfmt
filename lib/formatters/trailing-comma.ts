import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  SourceFile,
} from "typescript";

import { updateWithNode } from "../helpers/updater";
import { Context } from "./index";

export function format(sourceFile: SourceFile, ruleFailure: RuleFailure, context: Context) {
  return updateWithNode(sourceFile, ruleFailure, (node) => {
    const oldText = node.getFullText();
    return `${oldText},`;
  });
}
