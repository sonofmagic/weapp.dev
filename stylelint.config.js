import { defineStylelintConfig } from 'repoctl/tooling'

const config = await defineStylelintConfig()

config.overrides ??= []
config.overrides.push({
  files: ['**/src/styles/global.css'],
  rules: {
    // The repoctl rule does not resolve custom utilities declared by Tailwind v4's @theme.
    'tailwindcss/no-invalid-apply': null,
  },
})

export default config
