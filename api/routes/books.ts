import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { books } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const booksRouter = new Hono();

// Helper function for error handling
const handleError = (error: unknown) => {
  console.error(error);
  if (error instanceof Error) {
    return { error: error.message };
  }
  return { error: "An unknown error occurred" };
};

booksRouter.get("/", async (c) => {
  try {
    const allBooks = await drizzle.select().from(books);
    return c.json(allBooks);
  } catch (error) {
    const { error: message } = handleError(error);
    return c.json({ success: false, message }, 500);
  }
});

booksRouter.get("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }

    const result = await drizzle.query.books.findFirst({
      where: eq(books.id, id),
    });

    if (!result) {
      return c.json({ error: "Book not found" }, 404);
    }
    return c.json(result);
  } catch (error) {
    const { error: message } = handleError(error);
    return c.json({ success: false, message }, 500);
  }
});

// router.js
booksRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1),
      author: z.string().min(1),
      publishedAt: z.string() // ใช้ camelCase ตาม request
        .refine(val => dayjs(val).isValid(), { 
          message: "Invalid date format" 
        })
        .transform(val => new Date(val)),
      genre: z.string().optional(),
      summary: z.string().optional(),
    }).transform(data => ({
      // แปลงกลับเป็น snake_case ก่อนส่งเข้า database
      ...data,
      published_at: data.publishedAt
    }))
  ),
  async (c) => {
    try {
      const { title, author, published_at, genre, summary } = c.req.valid("json");
      
      const result = await drizzle
        .insert(books)
        .values({
          title,
          author,
          published_at,
          genre: genre ?? null,
          summary: summary ?? null,
        })
        .returning();

      return c.json({ success: true, book: result[0] }, 201);
    } catch (error) {
      const { error: message } = handleError(error);
      return c.json({ success: false, message }, 500);
    }
  }
);

booksRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      title: z.string().min(1).optional(),
      author: z.string().min(1).optional(),
      publishedAt: z.string()  // ใช้ camelCase
        .refine(val => dayjs(val).isValid(), { 
          message: "Invalid date format" 
        })
        .transform(val => new Date(val))
        .optional(),
      genre: z.string().optional(),
      summary: z.string().optional(),
    }).transform(data => ({
      ...data,
      published_at: data.publishedAt
    }))
  ),
  async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const data = c.req.valid("json");
      
      const updated = await drizzle
        .update(books)
        .set(data)
        .where(eq(books.id, id))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: "Book not found" }, 404);
      }
      return c.json({ success: true, book: updated[0] });
    } catch (error) {
      const { error: message } = handleError(error);
      return c.json({ success: false, message }, 500);
    }
  }
);

booksRouter.delete("/:id", async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID format" }, 400);
    }

    const deleted = await drizzle
      .delete(books)
      .where(eq(books.id, id))
      .returning();

    if (deleted.length === 0) {
      return c.json({ error: "Book not found" }, 404);
    }
    return c.json({ success: true, book: deleted[0] });
  } catch (error) {
    const { error: message } = handleError(error);
    return c.json({ success: false, message }, 500);
  }
});

export default booksRouter;