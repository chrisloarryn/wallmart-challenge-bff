import 'reflect-metadata';

import dotenv from 'dotenv'
dotenv.config()
var colors = require('colors')
// @ts-ignore
import * as Tracing from '@sentry/tracing'
//SERVER
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import express from 'express'
//MIDDLEWARES
import compression from 'compression'
import cors from 'cors'
import expressPlayGround from 'graphql-playground-middleware-express'
//SCHEMA
import { createSchema } from './utils/createSchema'

import { graphqlUploadExpress } from 'graphql-upload'

const listen = async () => {
  const schema = await createSchema()

  const apolloServer = new ApolloServer({
    uploads: false, // disable apollo upload property
    schema,
    formatError: (a) => {

      return a
    },
    context: ({ req, res }) => {
      return {
        req,
        res,
        token: req.headers.authorization
      }
    }
  })
  const app = express()
  app.use(compression())
  app.use(cors())

  app.use(graphqlUploadExpress({ maxFileSize: 2 * 1000 * 1000, maxFiles: 10 }))
  apolloServer.applyMiddleware({ app })

  app.get('/', expressPlayGround({ endpoint: '/graphql' }))

  let PORT = process.env.PORT || '3000'
  const httpServer = createServer(app)
  httpServer.listen({ port: PORT }, () =>
    console.log(
      colors.inverse(
        `🚀🚀 SERVIDOR CORRIENDO 🚀🚀 http://localhost:${PORT}${apolloServer.graphqlPath}`
      )
    )
  )
}
listen().catch((error) => {
  console.log('error', error)
})
