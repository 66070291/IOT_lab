import * as t from "drizzle-orm/pg-core";
// import { relations } from 'drizzle-orm';

export const students = t.pgTable("students", {
  id: t.serial("id").primaryKey(),
  firstname: t.varchar("firstname", { length: 255 }).notNull(),
  lastname: t.varchar("lastname", { length: 255 }).notNull(),
  student_id: t.varchar("student_id", { length: 8 }).notNull(),
  birthdate: t.timestamp("birthdate").notNull(),
  gender: t.varchar("gender", { length: 1 }).notNull(),
});

// export const genres = t.pgTable("genres", {
//   id: t.bigserial({ mode: "number" }).primaryKey(),
//   title: t
//     .varchar({
//       length: 255,
//     })
//     .notNull(),
// });


export const books = t.pgTable("books", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t.varchar({ length: 255 }).notNull(),
  author: t.varchar({ length: 255 }).notNull(),
  published_at: t.timestamp().notNull(), // เปลี่ยนเป็น snake_case
  summary: t.text(),
  genre: t.varchar({ length: 100 }),
});

// export const bookRelations = relations(books, ({ one }) => ({
//   genre: one(genres, {
//     fields: [books.genreId],
//     references: [genres.id],
//   }),
// }));