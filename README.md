# relay-mongodb-connection [![Build Status](https://travis-ci.org/mikberg/relay-mongodb-connection.svg?branch=master)](https://travis-ci.org/mikberg/relay-mongodb-connection) [![Coverage Status](https://coveralls.io/repos/mikberg/relay-mongodb-connection/badge.svg?branch=master&service=github)](https://coveralls.io/github/mikberg/relay-mongodb-connection?branch=master)

> Like `connectionFromMongoCursor()` but for Mongoose queries

## Install

```sh
npm install --save shenyzore/relay-mongoose-connection
```

## Usage

Give it a query from [mongoose](https://www.npmjs.com/package/mongoose), and it handles pagination int he same way [graphql-relay](https://github.com/graphql/graphql-relay-js/blob/master/src/connection/arrayconnection.js) does for arrays.

### At a glance

Pass it a Mongoose query and `connectionArgs`, and it's happy.

```js
async resolve(obj, { ...args }) {
  return await connectionFromMongooseQuery(
    User.find({}),
    args
  );
}
```

Optionally give it a mapper function:

```js
async resolve(obj, { ...args }) {
  return await connectionFromMongoCursor(
    User.find({}),
    args,
    (user) => Object.assign(user, { id: user._id })
  );
}
```

### Example

```js
// ...
import connectionFromMongooseQuery from 'relay-mongoose-connection';
// ...

// Instead of resolving, synchronously returns a Mongoose Query.
function getSpaceshipsForUser(userId) {
  return Spaceships.find({
    user: new ObjectId(userId)
  });
}

export const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    spaceships: {
      type: SpaceshipConnection,
      args: {
        ...connectionArgs,
      },
      async resolve(user, { ...args }) {
        const spaceshipCursor = getSpaceshipsForUser(user._id);
        return await connectionFromMongooseQuery(spaceshipCursor, args);
      }
    }
  }
});
```

`connectionFromMongooseQuery` automatically skips and limits the Mongoose Query so that only the necessary documents are retrieved from the database.

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## Testing

Set a MongoDB connection string as environment variable:

```sh
export MONGO_CONNECTION_STRING=mongodb://192.168.99.100/mongodbconnection
```

Then run tests

```sh
npm test
```

## License

MIT © [Mikael Berg](https://github.com/mikberg)
