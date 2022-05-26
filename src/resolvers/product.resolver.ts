import {
  Arg,
  Query,
  Resolver,
} from 'type-graphql'
import { Product } from '../models/product.model'
import { FindAllParams, Pagination } from '../types/product-input';
import * as _ from 'lodash'
import a from 'axios'

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => [Product])
  async allProducts(@Arg('input', { nullable: true }) pagination: Pagination): Promise<Product[]> {
    if (!pagination) pagination = { skip: 0, limit: 10 }
    const { skip = 0, limit = 10 } = pagination
    const { data } = await a.get(`http://localhost:8080/api/v1/products?limit=${limit ?? 10}&skip=${skip ?? 0}`) // a.get('http://54.196.205.115:8080/api/v1/products')
    return data && data.length > 0 ? data.map((p: Product) => ({ ...p, isPalindrome: p.isPalindrome ?? false})) : []
  }

  @Query(() => [Product])
  async searchForProducts(@Arg('input') { params, pagination }: FindAllParams): Promise<Product[]> {
    if (!pagination) pagination = { skip: 0, limit: 10 }
    if (_.isEmpty(params)) throw new Error('No params provided')
    if (params && Object.values(params).filter(Boolean).length === 0) throw new Error('Params must NOT be empty')

    let searchParam = '', idParam = ''

    if ((!!params.search && !params.id) && params.search.length < 4) throw new Error('Search must be at least 3 characters long')
    if (params.search && params.search.length > 3) searchParam = `&s=${params.search}`
    if (!params.search && !!params.id) idParam = `&id=${params.id}`
    if ((params.search && params.search.length < 3) && (params.id && params.id.length>=1)) idParam = `&id=${params.id}`
    if ((params.search && params.search.length > 3) && (params.id && params.id.length>=1)) searchParam = `&s=${params.search}`

    const { skip = 0, limit = 10 } = pagination

    const url = `http://localhost:8080/api/v1/products?limit=${limit ?? 10}&skip=${skip ?? 0}${searchParam}${idParam}`

    console.log(url)
    const { data } = await a.get(url)

    if(!_.isArray(data)) throw new Error('No data found')

    return data && data.length > 0 ? data.map((p: Product) => ({ ...p, isPalindrome: p.isPalindrome ?? false})) : []
  }
}
