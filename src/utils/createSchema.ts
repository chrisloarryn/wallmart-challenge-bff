import path from 'path';
// import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
//RESOLVERS
import { ProductResolver } from './../resolvers/product.resolver';

export const createSchema = () =>
  buildSchema({
    // container: Container,
    resolvers: [
      ProductResolver,
    ],
    emitSchemaFile: path.resolve(__dirname, '../../src/schema', 'schema.gql')
  });
