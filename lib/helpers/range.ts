import { RuleFailure } from "tslint/lib/language/rule/rule";
import {
  Node,
} from "typescript";

export default class Range {

  public static createWithRuleFailure(ruleFailure: RuleFailure): Range {
    return new Range(
      ruleFailure.getStartPosition().getPosition(),
      ruleFailure.getEndPosition().getPosition()
    );
  }

  public static createWithNode(node: Node): Range {
    return new Range(
      node.getStart(),
      node.getEnd()
    );
  }

  constructor(public start: number, public end: number) { }

  public equals(range: Range): boolean {
    return range.start === this.start && range.end === this.end;
  }

  public contains(range: Range): boolean {
    return this.start <= range.start && range.end <= this.end;
  }
}
