import {
  SyntaxKind,
  Node,
  ScriptTarget,
  SourceFile,
  createSourceFile,
  forEachChild,
  LineAndCharacter,
} from 'typescript'
import { RuleFailure } from "tslint/lib/language/rule/rule"

import {warn, toPosString} from './logger'

export function findNode(sourceFile: SourceFile, ruleFailure: RuleFailure) {
  const start = ruleFailure.getStartPosition().getPosition()
  const end = ruleFailure.getEndPosition().getPosition()
  let found: Node
  forEachChild(sourceFile, (node) => {
    if (found != null) return
    found = findChild(node, start, end)
  })

  if (found == null) {
    warn(ruleFailure, `can't find node from ${toPosString(ruleFailure.getStartPosition().getLineAndCharacter())} to ${toPosString(ruleFailure.getEndPosition().getLineAndCharacter())} for`)
  }

  return found
}

export function findChild(node: Node, start: number, end: number): Node {
  if (!(node.getFullStart() <= start && end <= node.getEnd())) {
    return
  }
  const children = node.getChildren()
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    let found = findChild(child, start, end)
    if (found != null) {
      return found
    }
  }
  return node
}
