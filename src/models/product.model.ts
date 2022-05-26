import { ObjectType, Field, ID, Int, Float } from 'type-graphql';

@ObjectType({description: 'Product Model'})
export class Product {
    @Field(() => ID, {description: 'Brand ID', nullable: true})
    _id: string;

    @Field(() => Int, {nullable: true})
    id: string;

    @Field({description: 'Brand', nullable: true})
    brand: string;

    @Field({description: 'Description', nullable: true})
    description: string;

    @Field({description: 'Image', nullable: true})
    image: string;

    @Field(() => Int, {description: 'Price', nullable: true})
    price: number;

    @Field(() => Float, {description: 'Percentage', nullable: true})
    percentage: number;

    @Field(() => Float, {description: 'CalculatedPrice', nullable: true})
    calculatedPrice: number;

    @Field(() => Boolean, {description: 'isPalindrome', nullable: true})
    isPalindrome: boolean;
}

