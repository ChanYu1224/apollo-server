import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { v4 as uuidv4 } from 'uuid';

const schema = loadSchemaSync("./src/schema.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const books = [
  {
    uid: uuidv4(),
    title: 'The Society',
    category: 'SOCIETY',
    description: 'The Society is a book about the society',
  },
  {
    uid: uuidv4(),
    title: 'Pattern Recognition and Machine Learning',
    category: 'TECHNOLOGY',
    description: 'Pattern Recognition and Machine Learning is a book about the technology',
  },
  {
    uid: uuidv4(),
    title: 'The Novel',
    category: 'NOVEL',
    description: 'The Novel is a book about the novel',
  }
];

const resolvers = {
  Query: {
    getBooks: (_, serachQuery) => {
      return books
    },
    getBook: (_, {uid}) => books.find(book => book.uid === uid),
  },
  Mutation: {
    createBook: (_, book) => {
      const newBook = book.input;
      newBook.uid = uuidv4();
      books.push(newBook);
      return newBook;
    },

    updateBook: (_, {uid, book}) => {
      const updatedBook = book.input;
      const index = books.findIndex(book => book.uid === updatedBook.uid);
      const oldBook = books[index]

      for (const key in updatedBook) {
        if (updatedBook[key] !== oldBook[key]) {
          books[index] = {...books[index], ...updatedBook};
        }
      }

      books[index] = {...books[index], ...updatedBook};

      return books[index];
    },
    
    deleteBook: (_, {uid}) => {
      const index = books.findIndex(book => book.uid === uid);
      if (index === -1) return false;
      books.splice(index, 1);
      return true;
    }
  }
};

const schemaWithResolvers = addResolversToSchema({schema, resolvers});
const server = new ApolloServer({ schema: schemaWithResolvers});

const {url} = await startStandaloneServer(server, {
  listen: {port: 4000},
});

console.log(`Server ready at ${url}`)