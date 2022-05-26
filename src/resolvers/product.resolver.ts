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
    const { API_URL = "https://wallmart-challenge-rest.herokuapp.com/api/v1" } = process.env

    if (!pagination) pagination = { skip: 0, limit: 10 }
    const { skip = 0, limit = 10 } = pagination
    const { data } = await a.get(`${API_URL}/products?limit=${limit ?? 10}&skip=${skip ?? 0}`) // a.get('http://54.196.205.115:8080/api/v1/products')
    return data && data.length > 0 ? data.map((p: Product) => ({ ...p, isPalindrome: p.isPalindrome ?? false})) : []
  }

  @Query(() => [Product])
  async searchForProducts(@Arg('input', { nullable: true }) allParams: FindAllParams): Promise<Product[]> {
    const { API_URL = "https://wallmart-challenge-rest.herokuapp.com/api/v1" } = process.env

    if (!allParams) {
      const url = `${API_URL}/products?limit=5000&skip=0`

      const { data } = await a.get(url)

      if(!_.isArray(data)) throw new Error('No data found')

      return data && data.length > 0 ? data.map((p: Product) => ({ ...p, isPalindrome: p.isPalindrome ?? false})) : []
    }
    if (!allParams.pagination) allParams.pagination = { skip: 0, limit: 10 }
    if (_.isEmpty(allParams.params)) throw new Error('No params provided')
    if (allParams.params && Object.values(allParams.params).filter(Boolean).length === 0) throw new Error('Params must NOT be empty')

    let searchParam = '', idParam = ''

    if ((!!allParams.params.search && !allParams.params.id) && allParams.params.search.length < 4) throw new Error('Search must be at least 3 characters long')
    if (allParams.params.search && allParams.params.search.length > 3) searchParam = `&s=${allParams.params.search}`
    if (!allParams.params.search && !!allParams.params.id) idParam = `&id=${allParams.params.id}`
    if ((allParams.params.search && allParams.params.search.length < 3) && (allParams.params.id && allParams.params.id.length>=1)) idParam = `&id=${allParams.params.id}`
    if ((allParams.params.search && allParams.params.search.length > 3) && (allParams.params.id && allParams.params.id.length>=1)) searchParam = `&s=${allParams.params.search}`

    const { skip = 0, limit = 10 } = allParams.pagination

    const url = `${API_URL}/products?limit=${limit ?? 10}&skip=${skip ?? 0}${searchParam}${idParam}`

    const { data } = await a.get(url)

    if(!_.isArray(data)) throw new Error('No data found')

    return data && data.length > 0 ? data.map((p: Product) => ({ ...p, isPalindrome: p.isPalindrome ?? false})) : []
  }
}
