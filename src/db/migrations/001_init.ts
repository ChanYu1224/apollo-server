import { Kysely } from "kysely";

const ID = "varchar(30)";
const SMALL_VARVARCHAR = "varchar(30)";
const NORMAL_VARVARCHAR = "varchar(255)";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("user")
        .addColumn("id", ID, (col) => col.primaryKey())
        .addColumn("type", SMALL_VARVARCHAR, (col) => col.notNull())
        .addColumn("name", NORMAL_VARVARCHAR, (col) => col.notNull())
        .execute();

    await db.schema
        .createTable("book")
        .addColumn("id", ID, (col) => col.primaryKey())
        .addColumn("title", NORMAL_VARVARCHAR, (col) => col.notNull())
        .addColumn("category", SMALL_VARVARCHAR, (col) => col.notNull())
        .addColumn("description", "text")
        .execute();
    
    await db.schema
        .createTable("review")
        .addColumn("id", ID, (col) => col.primaryKey())
        .addColumn("rating", "smallint", (col) => col.notNull())
        .addColumn("comment", "text")
        .execute();
    
    await db.schema
        .createTable("book_status")
        .addColumn("id", ID, (col) => col.primaryKey())
        .addColumn("book_id", ID, (col) => 
            col.references("book.id").onDelete("cascade").notNull()
        )
        .addColumn("review_id", ID, (col) => 
            col.references("review.id").onDelete("cascade")
        )
        .addColumn("progress", ID, (col) => col.defaultTo("NOT_STARTED"))
        .execute();
    
    await db.schema
        .createTable("user_bookstatus_relation")
        .addColumn("user_id", ID, (col) => 
            col.references("user.id").onDelete("cascade").notNull()
        )
        .addColumn("book_status_id", ID, (col) => 
            col.references("book.id").onDelete("cascade").notNull()
        )
        .addPrimaryKeyConstraint("primary_key", ["user_id", "book_status_id"])
        .execute();
    
    await db.schema
        .createTable("book_review_relation")
        .addColumn("book_id", ID, (col) => 
            col.references("book.id").onDelete("cascade").notNull()
        )
        .addColumn("review_id", ID, (col) =>
            col.references("review.id").onDelete("cascade").notNull()
        )
        .addPrimaryKeyConstraint("primary_key", ["book_id", "review_id"])
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("user").execute();
    await db.schema.dropTable("book").execute();
    await db.schema.dropTable("review").execute();
    await db.schema.dropTable("book_status").execute();
    await db.schema.dropTable("user_bookstatus_relation").execute();
    await db.schema.dropTable("book_review_relation").execute();
}
