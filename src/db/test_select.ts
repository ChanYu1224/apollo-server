import { Book } from "kysely-codegen";
import { db } from "./database";

async function selectBook() {
  const books: Book[] = await db.selectFrom("book").selectAll().execute();
  console.log(books);
}

selectBook();