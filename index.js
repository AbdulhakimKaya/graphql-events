const {ApolloServer, gql} = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core')

const uid = function(){ return Date.now().toString(36) + Math.random().toString(36).substr(2); }

const {events, locations, users, participants} = require('./data')

const typeDefs = gql`
    # event
    type Event {
        id: ID!
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: ID!
        location: Location!
        user_id: ID!
        user: User!
        participants: [Participant!]!
    }
    input CreateEventInput {
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: ID!
        user_id: ID!
    }   
    
    # location
    type Location {
        id: ID!
        name: String!
        desc: String!
        lat: Float!
        lng: Float!
    }
    input CreateLocationInput {
        name: String!
        desc: String!
        lat: Float!
        lng: Float!
    }

    # user
    type User {
        id: ID!
        username: String!
        email: String!
    }
    input CreateUserInput {
        username: String!
        email: String!
    }

    # participant
    type Participant {
        id: ID!
        user_id: ID!
        event_id: ID!
        user: User!
    }
    input CreateParticipantInput {
        user_id: ID!
        event_id: ID!
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
    
    type Mutation {
        # user
        createUser(data: CreateUserInput!): User!
        
        # location
        createLocation(data: CreateLocationInput!): Location!
        
        # participant
        createParticipant(data: CreateParticipantInput!): Participant!
        
        # event
    createEvent(data: CreateEventInput!): Event!
    }
`;

const resolvers = {
    Mutation: {
        // user
        createUser: (parent, {data}) => {
            const user = {
                id: uid(),
                ...data
            }
            users.push(user)
            return user
        },

        // location
        createLocation: (parent, {data}) => {
            const location = {
                id: uid(),
                ...data
            }
            locations.push(location)
            return location
        },

        // participant
        createParticipant: (parent, {data}) => {
            const participant = {
                id: uid(),
                ...data
            }
            participants.push(participant)
            return participant
        },

        // event
        createEvent: (parent, {data}) => {
            const event = {
                id: uid(),
                ...data
            }
            events.push(event)
            return event
        },
    },

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
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
})

server.listen().then(({url}) => console.log(`Apollo servers is up ${url}`))