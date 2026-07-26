import type { Rule } from 'eslint'
import * as estree from 'estree'

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require arrow functions instead of function declarations',
      recommended: true,
    },
    fixable: undefined,
    schema: [],
  },
  create(context: Rule.RuleContext) {
    return {
      FunctionDeclaration(node: estree.FunctionDeclaration & Rule.NodeParentExtension) {
        // Skip if it's an async function at top level (like lifecycle hooks)
        if (node.id) {
          context.report({
            node,
            message: `Function "${node.id.name}" should be an arrow function instead of a function declaration`,
          })
        }
      },
      FunctionExpression(node: estree.FunctionExpression & Rule.NodeParentExtension) {
        // Check if this is a non-arrow function expression assigned to a variable
        const parent = node.parent

        // Only warn if it's a variable declaration or assignment expression
        if (parent && !node.async) {
          let name = 'unnamed'

          if ('type' in parent) {
            if (parent.type === 'VariableDeclarator' && 'id' in parent) {
              const id = parent.id as estree.Identifier
              if (id && 'name' in id) {
                name = id.name
              }
            } else if (parent.type === 'AssignmentExpression' && 'left' in parent) {
              const left = parent.left as estree.Identifier
              if (left && 'name' in left) {
                name = left.name
              }
            }
          }

          context.report({
            node,
            message: `Function "${name}" should use arrow function syntax: const ${name} = () => {}`,
          })
        }
      },
    }
  },
}

export default rule
