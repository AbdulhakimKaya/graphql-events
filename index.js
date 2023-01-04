const {ApolloServer, gql} = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core')

const {events, locations, users, participants} = require('./data')

const typeDefs = gql`
    type Event {
        id: ID!
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: ID
        location: Location!
        user_id: ID!
        user: User!
        participants: [Participant!]!
    }

    type Location {
        id: ID!
        name: String!
        desc: String!
        lat: Float!
        lng: Float!
    }

    type User {
        id: ID!
        username: String!
        email: String!
    }

    type Participant {
        id: ID!
        user_id: ID!
        event_id: ID!
        user: User!
    }

    type Query {
        # user
        users: [User!]!
        user(id: ID!): User!
        
        # location
        locations: [Location!]!
        location(id: ID!): Location!
        
        # participant
        participants: [Participant!]!
        participant(id: ID!): Participant!
        
        #event
        events: [Event!]!
        event(id: ID!): Event!
    }
`;

const resolvers = {
    Query: {
        // user
        users: () => users,
        user: (parent, args) => users.find((user) => user.id === args.id),

        // location
        locations: () => locations,
        location: (parent, args) => locations.find((location) => location.id === args.id),

        // participant
        participants: () => participants,
        participant: (parent, args) => participants.find((participant) => participant.id === args.id),

        // event
        events: () => events,
        event: (parent, args) => events.find((event) => event.id === args.id),
    },
    Event: {
        user: (parent) => users.find((user) => user.id === parent.user_id),
        location: (parent) => locations.find((location) => location.id === parent.location_id),
        participants: (parent) => participants.filter((participant) => participant.user_id === parent.id)
    },
    Participant: {
        user: (parent) => users.find((user) => user.id === parent.user_id)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
})

server.listen().then(({url}) => console.log(`Apollo servers is up ${url}`))