import { v1 as neo4j } from "neo4j-driver";
/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */
const driver = neo4j.driver(
    process.env.DATABASE_HOST + ":" + process.env.DATABASE_PORT || "bolt://neo4j.local.com:7687",
    neo4j.auth.basic(
        process.env.DATABASE_USER || "neo4j",
        process.env.DATABASE_PASS || "letmein"
    )
);

export { driver }
