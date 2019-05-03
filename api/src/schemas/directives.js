import { SchemaDirectiveVisitor } from 'graphql-tools'

class HideTheFieldDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition (field) {
        field.resolve = async (...args) => 'This is secret! ;)'
    }
    visitArgumentDefinition(argument) {
        argument.resolve = async (...args) => 'This is secret! ;)'
    }
    visitInputFieldDefinition(field) {
        field.resolve = async (...args) => 'This is secret! ;)'
    }
}

const schemaDirectives = {
    hideTheField: HideTheFieldDirective,
}

const directives = `directive @hideTheField on FIELD_DEFINITION | INPUT_FIELD_DEFINITION | ARGUMENT_DEFINITION`

export { schemaDirectives, directives }
