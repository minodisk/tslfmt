import * as fs from "fs";
import * as Linter from "tslint";
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

import {Context, layers} from "./formatters";
import {warn} from "./helpers/logger";
import {updateWithNode, updateWithLineAndCharacter} from "./helpers/updater";

export function transform(filepath: string) {
  console.log(`[tslfmt] formatting ${filepath} ...`);

  const configuration = Linter.findConfiguration(null, filepath);
  const source = fs.readFileSync(filepath, "utf8");

  const sourceFile = update(filepath, source, configuration);
  // console.log("---------");
  // console.log(sourceFile.getFullText());
  fs.writeFile(filepath, sourceFile.getFullText(), (err) => {
    if (err != null) {
      console.warn(`[tslfmt] can't write file ${filepath}`);
    }
  });
}

export function update(filepath: string, source: string, configuration: any): SourceFile {
  let sourceFile = createSourceFile(filepath, source, ScriptTarget.ES5, true);
  for (let i = 0; i < layers.length; i++) {
    const linter = new Linter(filepath, sourceFile.getFullText(), { configuration });
    const result = linter.lint();

    if (result.failures.length === 0) {
      console.log("[tslfmt]", "  perfect");
      break;
    }

    const formatters = layers[i];
    const context = { formatters };
    result.failures
      .sort((a, b) => {
        const aPri = priority(a, context);
        const bPri = priority(b, context);
        const diffPri = bPri - aPri;
        if (diffPri !== 0) {
          return diffPri;
        }

        const aEnd = a.getEndPosition().getPosition();
        const bEnd = b.getEndPosition().getPosition();
        const diffEnd = bEnd - aEnd;
        if (diffEnd !== 0) {
          return diffEnd;
        }

        const aStart = a.getStartPosition().getPosition();
        const bStart = b.getStartPosition().getPosition();
        return bStart - aStart;
      })
      .forEach((failure) => {
        sourceFile = fix(sourceFile, failure, context);
      });
  }
  return sourceFile;
}

export function fix(sourceFile: SourceFile, ruleFailure: RuleFailure, context: Context) {
  const formatter = context.formatters[ruleFailure.getRuleName()];

  if (formatter == null || formatter.format == null) {
    // warn(ruleFailure, `no formatter for`)
    return sourceFile;
  }

  const formattedSourceFile = formatter.format(sourceFile, ruleFailure, context);
  if (formattedSourceFile == null) {
    warn(ruleFailure, `can't format with`);
    return sourceFile;
  }
  return formattedSourceFile;
}

function priority(ruleFailure: RuleFailure, {formatters}) {
  const formatter = formatters[ruleFailure.getRuleName()];
  if (formatter == null || formatter.priority == null) {
    return 0;
  }
  return formatter.priority;
}
