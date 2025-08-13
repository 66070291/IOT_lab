// // Fun Assignment, Implement this.
// // src/routes/genre.ts
// import { Hono } from "hono";
// import drizzle from "../db/drizzle.js";
// import { genres } from "../db/schema.js";
// import { eq } from "drizzle-orm";
// import { z } from "zod";
// import { zValidator } from "@hono/zod-validator";

// const genreRouter = new Hono();

// // GET /genres - ดึงประเภททั้งหมด
// genreRouter.get("/", async (c) => {
//   const allGenres = await drizzle.select().from(genres);
//   return c.json(allGenres);
// });

// // GET /genres/:id - ดึงประเภทตาม ID
// genreRouter.get("/:id", async (c) => {
//   const id = Number(c.req.param("id"));
//   const result = await drizzle.query.genres.findFirst({
//     where: eq(genres.id, id),
//   });

//   if (!result) {
//     return c.json({ error: "Genre not found" }, 404);
//   }
//   return c.json(result);
// });

// // POST /genres - สร้างประเภทใหม่
// genreRouter.post(
//   "/",
//   zValidator(
//     "json",
//     z.object({
//       title: z.string().min(1).max(255),
//     })
//   ),
//   async (c) => {
//     const { title } = c.req.valid("json");
//     const result = await drizzle
//       .insert(genres)
//       .values({ title })
//       .returning();
    
//     return c.json({ success: true, genre: result[0] }, 201);
//   }
// );

// // PATCH /genres/:id - อัปเดตประเภท
// genreRouter.patch(
//   "/:id",
//   zValidator(
//     "json",
//     z.object({
//       title: z.string().min(1).max(255).optional(),
//     })
//   ),
//   async (c) => {
//     const id = Number(c.req.param("id"));
//     const data = c.req.valid("json");
    
//     const updated = await drizzle
//       .update(genres)
//       .set(data)
//       .where(eq(genres.id, id))
//       .returning();

//     if (updated.length === 0) {
//       return c.json({ error: "Genre not found" }, 404);
//     }
//     return c.json({ success: true, genre: updated[0] });
//   }
// );

// // DELETE /genres/:id - ลบประเภท
// genreRouter.delete("/:id", async (c) => {
//   const id = Number(c.req.param("id"));
//   const deleted = await drizzle
//     .delete(genres)
//     .where(eq(genres.id, id))
//     .returning();

//   if (deleted.length === 0) {
//     return c.json({ error: "Genre not found" }, 404);
//   }
//   return c.json({ success: true, genre: deleted[0] });
// });

// export default genreRouter;