import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  SourceFile,
} from "typescript";

import { updateWithText } from "../helpers/updater";
import { Context } from "./index";

export function format(sourceFile: SourceFile, ruleFailure: RuleFailure, context: Context) {
  const [{}, wrong, correct] = ruleFailure.getFailure().match(/^(['"`])\s+should\s+be\s+(['"`])$/);
  if (!wrong || !correct) {
    return;
  }
  return updateWithText(sourceFile, ruleFailure, (oldText) => {
    return oldText.replace(/['"`]([\s\S]*)['"`]/, `${correct}$1${correct}`);
  });
}
