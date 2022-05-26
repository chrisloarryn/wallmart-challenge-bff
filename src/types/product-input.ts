import {InputType, Field, Int} from 'type-graphql'

@InputType({
    description: 'Pagination'
})
export class Pagination {
    @Field(() => Int, {
        description: 'skip',
        nullable: true
    })
    skip: number;

    @Field(() => Int, {
        description: 'limit',
        nullable: true
    })
    limit: number;
}

@InputType({
    description: 'Parameters for filtering'
})
class Parameter {
    @Field({
        description: 'search',
        nullable: true
    })
    search: string;

    @Field({
        description: 'id',
        nullable: true
    })
    id: string;
}

@InputType({
    description: 'FindAllParams'
})
export class FindAllParams {
    @Field(() => Pagination, {
        description: 'Pagination',
        nullable: true
    })
    pagination: Pagination;

    @Field(() => Parameter, {
        description: 'Params',
        nullable: true
    })
    params: Parameter
}