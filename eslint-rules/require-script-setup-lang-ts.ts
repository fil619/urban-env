import type { Rule } from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require lang="ts" attribute on all <script setup> tags',
      recommended: true,
    },
    fixable: undefined,
    schema: [],
  },
  create(context: Rule.RuleContext) {
    const sourceCode = context.sourceCode
    const content = sourceCode.getText()

    // Check for plain <script> tags (without setup) - flag as error
    const plainScriptRegex = /<script(?!\s+setup)([^>]*)>/g
    let match = plainScriptRegex.exec(content)
    if (match) {
      const lineNumber = content.substring(0, match.index).split('\n').length
      context.report({
        loc: { line: lineNumber, column: 0 },
        message: 'Use <script setup lang="ts"> instead of plain <script> tags',
      })
    }

    // Find all <script setup> tags and ensure they have lang="ts"
    const scriptSetupRegex = /<script\s+setup([^>]*)>/g
    while ((match = scriptSetupRegex.exec(content)) !== null) {
      const attributes = match[1]

      // Check if lang="ts" or lang='ts' exists in the attributes
      if (!/lang\s*=\s*["']ts["']/.test(attributes)) {
        const lineNumber = content.substring(0, match.index).split('\n').length

        context.report({
          loc: { line: lineNumber, column: 0 },
          message: 'All <script setup> tags must have lang="ts" attribute',
        })
      }
    }

    return {}
  },
}

export default rule
