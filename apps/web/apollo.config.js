// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path')

module.exports = {
  client: {
    excludes: [
      '**/public/**/*.js',
      '**/node_modules/**/*',
      '**/.next/**/*',
      '**/generated/*',
    ],
    service: {
      name: 'all-in-one-graphql-music',
      // url: ' http://localhost:4000/___graphql',
      localSchemaFile: path.resolve(__dirname, './graphql.schema.json'),
      // skipSSLValidation: true,
    },
  },
}
