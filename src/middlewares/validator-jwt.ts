import { MiddlewareFn, ResolverData } from 'type-graphql';
var jwt = require('jsonwebtoken');

export const validateJWT: MiddlewareFn = async (
  { context }: ResolverData<any>,
  next
) => {
  const token: string = context.token || '';
  if (!token) throw Error('No existent token');
  // try {
  const { uid, email } = await jwt.verify(token, process.env.SECRETKEY);
  if (!email && uid) throw Error('Token invalid');
  return await next();
  // } catch (error) {
  //     return Error('Error al validar token');
  // }
};
