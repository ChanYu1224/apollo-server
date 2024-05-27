import { db } from "./database.js";
import { DB } from "kysely-codegen"


const bookStatuses = [
    {
        id: "1",
        bookId: "1",
        progress: "READING",
        reviewId: "1",
    },
    {
        id: "2",
        bookId: "2",
        progress: "FINISHED",
        reviewId: "2",
    },
    {
        id: "3",
        bookId: "3",
        progress: "READING",
        reviewId: "3",
    },
    {
        id: "4",
        bookId: "3",
        progress: "FINISHED",
        reviewId: "4",
    },
];


const users = [
    {
        id: "1",
        type: "ADMIN",
        name: "Yuta Nishikawa",
        bookStatuses: [bookStatuses[0], bookStatuses[1]],
    },
    {
        id: "2",
        type: "USER",
        name: "Taro Yamada",
        bookStatusIds: ["3", "4"],
    },
];

const reviews = [
    {
        id: "1",
        rating: 4,
        comment: "good",
    },
    {
        id: "2",
        rating: 3,
        comment: "bad",
    },
    {
        id: "3",
        rating: 5,
        comment: "good",
    },
    {
        id: "4",
        rating: 2,
        comment: "bad",
    },
];

const books = [
    {
        id: "1",
        title: "The Society",
        category: "SOCIETY",
        description: "The Society is a book about the society",
        reviewIds: ["1", "2"],
    },
    {
        id: "2",
        title: "Pattern Recognition and Machine Learning",
        category: "TECHNOLOGY",
        description:
            "Pattern Recognition and Machine Learning is a book about the technology",
        reviewIds: ["3"],
    },
    {
        id: "3",
        title: "The Novel",
        category: "NOVEL",
        description: "The Novel is a book about the novel",
        reviewIds: ["4"],
    },
];


async function seed() {
    const rBooks = books.map((book) => ({ ...book, authors: undefined }));
    // const rBookAuthor = books.flatMap((book) =>
    //   book.authors.map((author) => ({ bookId: book.id, authorId: author.id }))
    // );
    // const rBookshelfs = bookshelfs.map((bookshelf) => ({
    //   id: bookshelf.id,
    //   ownerUserId: bookshelf.owner.id,
    // }));
    // const rBookshelfRecords = bookshelfRecords.map((record) => {
    //   const { book, bookshelf, ...rest } = record;
    //   return {
    //     bookId: book.id,
    //     bookshelfId: bookshelf.id,
    //     ...rest,
    //   };
    // });
    const tables = (await db.introspection.getTables()).map(
      (t) => t.name as keyof DB
    );
    await Promise.all(tables.map((t) => db.deleteFrom(t as keyof DB).execute()));
    await db.insertInto("book").values(rBooks).execute();
    // await db.insertInto("author").values(authors).execute();
    // await db.insertInto("bookAuthorRelation").values(rBookAuthor).execute();
    // await db.insertInto("user").values(users).execute();
    // await db.insertInto("bookshelf").values(rBookshelfs).execute();
    // await db.insertInto("bookshelfItem").values(rBookshelfRecords).execute();
    await db.destroy();
  }
  seed();