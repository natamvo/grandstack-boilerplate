import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import seedmutations from "./seed-mutations";
import fetch from "node-fetch";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const client = new ApolloClient({
  link: new createHttpLink({ uri: `http://${process.env.VIRTUAL_HOST}`, fetch }),
  cache: new InMemoryCache()
});

client
  .mutate({
    mutation: gql(seedmutations)
  })
  .then(data => console.log(data))
  .catch(error => console.error(error.message));
