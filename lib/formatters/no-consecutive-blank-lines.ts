import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  SourceFile,
} from "typescript";

import { updateWithLineAndCharacter } from "../helpers/updater";
import { Context } from "./index";

export function format(sourceFile: SourceFile, ruleFailure: RuleFailure, context: Context) {
  return updateWithLineAndCharacter(sourceFile, ruleFailure, (text) => {
    return text.replace(/\n+/, "");
  });
}
