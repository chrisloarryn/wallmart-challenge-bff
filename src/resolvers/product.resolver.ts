import {
  Arg,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql'
import { Product } from '../models/product.model'
import { validateJWT } from '../middlewares/validator-jwt'
import { FindAllParams } from '../types/product-input';


@Resolver(() => Product)
export class ProductResolver {
  @Query(() => [Product])
  async allProducts() {
    console.log('allProducts')
    return []
  }

  @Query(() => [Product])
  @UseMiddleware(validateJWT)
  async searchForProducts(@Arg('input') input: FindAllParams): Promise<Product[]> {
    console.log(input)
    return []
  }
}
