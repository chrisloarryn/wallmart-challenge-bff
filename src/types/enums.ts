import {registerEnumType} from 'type-graphql'

export enum KindType {
    KindOne,
    KindTwo,
    KindThree,
}


registerEnumType(KindType, {
    name: 'KindType', // this one is mandatory
    description: `The product search kind types are: ${Object.values(
        KindType
    ).join(', ')}` // this one is optional
})