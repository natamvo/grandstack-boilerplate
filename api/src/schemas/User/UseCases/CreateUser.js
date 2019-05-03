import { neo4jgraphql } from "neo4j-graphql-js";
import { ApolloError } from "apollo-server"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export default async (obj, params, ctx, resolveInfo) => {
  if(!validate(params.searchUserInput.email)) {
    throw new ApolloError('user_email_not_valid', 200, ['This user`s email is not valid'])
  }
  const findUser = await ctx.driver.session().run(
    `MATCH (u:User {email: "${params.searchUserInput.email}"}) return u`
  )
  if (findUser.records.length > 0) {
    throw new ApolloError('user_email_already_exists', 400, ['This user`s email already exists'])
  }

  params.dataUserInput.password = crypto.createHmac('sha256', process.env.SECRET).update(params.dataUserInput.password).digest('hex')
  params.dataUserInput.token = jwt.sign(
    {
      ID: params.ID,
      full_name: params.full_name,
      email: params.searchUserInput.email
    },
    process.env.SECRET,
    { expiresIn: '48h' }
  )

  const user =  await neo4jgraphql(obj, params, ctx, resolveInfo, true)
    return user
}


var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const validate = function(email)
{
	if (!email)
		return false;

	if(email.length>254)
		return false;

	var valid = tester.test(email);
	if(!valid)
		return false;

	// Further checking of some things regex can't handle
	var parts = email.split("@");
	if(parts[0].length>64)
		return false;

	var domainParts = parts[1].split(".");
	if(domainParts.some(function(part) { return part.length>63; }))
		return false;

	return true;
}
