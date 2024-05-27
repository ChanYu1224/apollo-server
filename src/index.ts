import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { db } from "./db/database";

const schema = loadSchemaSync("./src/schema.graphql", {
  loaders: [new GraphQLFileLoader()],
});


const users = [
  {
    id: '1',
    type: "ADMIN",
    name: 'Yuta Nishikawa',
    bookStatusIds: ['1', '2'],
  },
  {
    id: '2',
    type: "USER",
    name: 'Taro Yamada',
    bookStatusIds: ['3','4'],
  },
];

const bookStatuses = [
  {
    id: '1',
    bookId: '1',
    progress: "READING",
    reviewId: '1',
  },
  {
    id: '2',
    bookId: '2',
    progress: "FINISHED",
    reviewId: '2',
  },
  {
    id: '3',
    bookId: '3',
    progress: "READING",
    reviewId: '3',
  },
  {
    id: '4',
    bookId: '3',
    progress: "FINISHED",
    reviewId: '4',
  }
];


const reviews = [
  {
    id: '1',
    rating: 4,
    comment: 'good',
  },
  {
    id: '2',
    rating: 3,
    comment: 'bad',
  },
  {
    id: '3',
    rating: 5,
    comment: 'good',
  },
  {
    id: '4',
    rating: 2,
    comment: 'bad',
  }
];


const books = [
  {
    id: "1",
    title: 'The Society',
    category: 'SOCIETY',
    description: 'The Society is a book about the society',
    reviewIds: ['1', '2'],
  },
  {
    id: "2",
    title: 'Pattern Recognition and Machine Learning',
    category: 'TECHNOLOGY',
    description: 'Pattern Recognition and Machine Learning is a book about the technology',
    reviewIds: ['3'],
  },
  {
    id: "3",
    title: 'The Novel',
    category: 'NOVEL',
    description: 'The Novel is a book about the novel',
    reviewIds: ['4'],
  }
];

const resolvers = {
  Query: {
    getBooks: (parent, {searchQuery}) => {
      return books
    },
    getBook: (parent, {id}) => books.find(book => book.id === id),

    getUsers: () => {
      return users
    },

    getBookShelf: (parent, {userId}) => {
      const statusIds = users.find(user => user.id === userId).bookStatusIds;
      const bookShelf = statusIds.map(id => bookStatuses.find(status => status.id === id));
      return bookShelf;
    },
    getBookStatus: (parent, {id}) => bookStatuses.find(status => status.id === id),
  },
  Mutation: {
    createBook: (parent, {book}) => {
      const newBook = book;
      newBook.id = String(books.length + 1);
      books.push(newBook);
      return newBook;
    },
    updateBook: (parent, {book}) => {
      const updatedBook = book;
      const index = books.findIndex(book => book.id === updatedBook.id);

      for (const key in updatedBook) {
        if (updatedBook[key] !== books[index][key] && updatedBook[key] !== null) {
          books[index][key] = updatedBook[key];
        }
      }

      return books[index];
    },
    deleteBook: (parent, {id}) => {
      const index = books.findIndex(book => book.id === id);
      if (index === -1) return false;
      books.splice(index, 1);
      return true;
    },

    createBookStatus(parent, {bookStatus}) {
      const newBookStatus = bookStatus;
      newBookStatus.id = String(bookStatuses.length + 1);
      bookStatuses.push(newBookStatus);
      return newBookStatus;
    }
  },

  Book: {
    reviews: (parent) => {
      const {reviewIds} = parent;
      return reviewIds.map(id => reviews.find(review => review.id === id));
    },
    averageRating: (parent) => {
      const {reviewIds} = parent;
      const totalRating = reviewIds.reduce((acc, id) => {
        const review = reviews.find(review => review.id === id);
        return acc + review.rating;
      }, 0);
      return totalRating / reviewIds.length;
    },
  },

  User: {
    bookShelf: (parent) => {
      const {bookStatusIds} = parent;
      const bookShelf = bookStatusIds.map(id => bookStatuses.find(bookStatus => bookStatus === id))
      return bookShelf
    }
  },
};

const schemaWithResolvers = addResolversToSchema({schema, resolvers});
const server = new ApolloServer({ schema: schemaWithResolvers});

const {url} = await startStandaloneServer(server, {
  listen: {port: 4000},
  context: async ({req}) => {
    return { db };
  }
});

console.log(`Server ready at ${url}`)