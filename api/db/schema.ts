import * as t from "drizzle-orm/pg-core";

export const students = t.pgTable("students", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  studentId: t.varchar("studentId", { length: 20 }).notNull().unique(),
  firstName: t.varchar("firstName",{ length: 100 }).notNull(),
  lastName: t.varchar("lastName",{ length: 100 }).notNull(),
  birthDate: t.date().notNull(),

  gender: t
    .varchar("gender", {length: 1})
    .notNull(),
});

// export const genres = t.pgTable("genres", {
//   id: t.bigserial({ mode: "number" }).primaryKey(),
//   title: t
//     .varchar({
//       length: 255,
//     })
//     .notNull(),
// });

// export const books = t.pgTable("books", {
//   id: t.bigserial({ mode: "number" }).primaryKey(),
//   title: t
//     .varchar({
//       length: 255,
//     })
//     .notNull(),
//   author: t
//     .varchar({
//       length: 255,
//     })
//     .notNull(),
//   publishedAt: t.timestamp().notNull(),

//   genreId: t.bigint({ mode: "number" }).references(() => genres.id, {
//     onDelete: "set null",
//   }),
// });

// export const bookRelations = relations(books, ({ one }) => ({
//   genre: one(genres, {
//     fields: [books.genreId],
//     references: [genres.id],
//   }),
// }));
