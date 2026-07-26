import type { Rule } from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow empty style tags in Vue components',
      recommended: true,
    },
    fixable: undefined,
    schema: [],
  },
  create(context: Rule.RuleContext) {
    const sourceCode = context.sourceCode
    const content = sourceCode.getText()

    // Check for empty style tags (with or without scoped attribute)
    const emptyStyleRegex = /<style([^>]*)>\s*<\/style>/g
    let match

    while ((match = emptyStyleRegex.exec(content)) !== null) {
      // Get line number from the match position
      const lineNumber = content.substring(0, match.index).split('\n').length

      context.report({
        loc: { line: lineNumber, column: 0 },
        message: 'Empty style tags should be removed',
      })
    }

    return {}
  },
}

export default rule
