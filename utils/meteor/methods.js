export const userAuthorizedMethods = (methods) => Object.fromEntries(
    Object.entries(methods)
    .map(([name, method]) => [
        name,
        function(...args) {
            if (!this.userId) {
                throw new Meteor.Error('Not authorized.')
            }
            return method.apply(this, args)
        },
    ])
)
