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
    input UpdateEventInput {
        title: String
        desc: String
        date: String
        from: String
        to: String
        location_id: ID
        user_id: ID
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
    input UpdateLocationInput {
        name: String
        desc: String
        lat: Float
        lng: Float
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
    input UpdateUserInput {
        username: String
        email: String
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
    input UpdateParticipantInput {
        user_id: ID
        event_id: ID
    }   
    

    type DeleteAllOutput {
        count: Int!
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
        updateUser(id: ID!, data: UpdateUserInput!): User!
        deleteUser(id: ID!): User!
        deleteAllUser: DeleteAllOutput!
        
        # location
        createLocation(data: CreateLocationInput!): Location!
        updateLocation(id: ID!, data: UpdateLocationInput!): Location!
        deleteLocation(id: ID!): Location!
        deleteAllLocation: DeleteAllOutput!
        
        # participant
        createParticipant(data: CreateParticipantInput!): Participant!
        updateParticipant(id: ID!, data: UpdateParticipantInput!): Participant!
        deleteParticipant(id: ID!): Participant!
        deleteAllParticipant: DeleteAllOutput!
        
        # event
        createEvent(data: CreateEventInput!): Event!
        updateEvent(id: ID!, data: UpdateEventInput!): Event!
        deleteEvent(id: ID!): Event!
        deleteAllEvent: DeleteAllOutput!
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
        updateUser: (parent, {id, data}) => {
            const user_index = users.findIndex((user) => user.id === id)
            if (user_index === -1){
                throw new Error("User not Found")
            }
            const updated_user = (users[user_index] = {
                ...users[user_index],
                ...data
            })
            return updated_user
        },
        deleteUser: (parent, {id}) => {
            const user_index = users.findIndex((user) => user.id === id)
            if (user_index === -1){
                throw new Error("User not Found")
            }
            const deleted_user = users[user_index]
            users.splice(user_index, 1)
            return deleted_user
        },
        deleteAllUser: () => {
            const length = users.length
            users.splice(0, length)
            return {count: length}
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
        updateLocation: (parent, {id, data}) => {
            const location_index = locations.findIndex((location) => location.id === id)
            if (location_index === -1){
                throw new Error("Location not Found")
            }
            const updated_location = (locations[location_index] = {
                ...locations[location_index],
                ...data
            })
            return updated_location
        },
        deleteLocation: (parent, {id}) => {
            const location_index = locations.findIndex((location) => location.id === id)
            if (location_index === -1){
                throw new Error("Location not Found")
            }
            const deleted_location = locations[location_index]
            locations.splice(location_index, 1)
            return deleted_location
        },
        deleteAllLocation: () => {
            const length = locations.length
            locations.splice(0, length)
            return {count: length}
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
        updateParticipant: (parent, {id, data}) => {
            const participant_index = participants.findIndex((participant) => participant.id === id)
            if (participant_index === -1){
                throw new Error("Participant not Found")
            }
            const updated_participant = (participants[participant_index] = {
                ...participants[participant_index],
                ...data
            })
            return updated_participant
        },
        deleteParticipant: (parent, {id}) => {
            const participant_index = participants.findIndex((participant) => participant.id === id)
            if (participant_index === -1){
                throw new Error("Participant not Found")
            }
            const deleted_participant = participants[participant_index]
            participants.splice(participant_index, 1)
            return deleted_participant
        },
        deleteAllParticipant: () => {
            const length = participants.length
            participants.splice(0, length)
            return {count: length}
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
        updateEvent: (parent, {id, data}) => {
            const event_index = events.findIndex((event) => event.id === id)
            if (event_index === -1){
                throw new Error("Event not Found")
            }
            const updated_event = (events[event_index] = {
                ...events[event_index],
                ...data
            })
            return updated_event
        },
        deleteEvent: (parent, {id}) => {
            const event_index = events.findIndex((event) => event.id === id)
            if (event_index === -1){
                throw new Error("Event not Found")
            }
            const deleted_event = events[event_index]
            events.splice(event_index, 1)
            return deleted_event
        },
        deleteAllEvent: () => {
            const length = events.length
            events.splice(0, length)
            return {count: length}
        }
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