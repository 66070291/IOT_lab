// Fun Assignment, Implement this.
import { Hono } from "hono";
import drizzle from "../db/drizzle.js";
import { students } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import dayjs from "dayjs";

const studentsRouter = new Hono();

studentsRouter.get("/", async (c) => {
  const allStudent = await drizzle.select().from(students);
  return c.json(allStudent);
});

studentsRouter.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const result = await drizzle.query.students.findFirst({
    where: eq(students.id, id),
    with: {
      genre: true,
    },
  });
  if (!result) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json(result);
});

studentsRouter.post(
  "/",
  zValidator(
    "json",
    z.object({
        studentId: z.string().length(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        birthDate: z.string().length(8),
      
        gender: z.string().min(1),
    })
  ),
  async (c) => {
    const {studentId, firstName, lastName, birthDate, gender} = c.req.valid("json")
    const result = await drizzle
      .insert(students)
      .values({
        studentId, firstName, lastName, birthDate, gender,
      })
      .returning();
    return c.json({ success: true, students: result[0] }, 201);
  }
);

studentsRouter.patch(
  "/:id",
  zValidator(
    "json",
    z.object({
      studentId: z.string().length(8),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      birthDate: z.string().length(8), // "YYYYMMDD"
      gender: z.enum(["M", "F", "O"]),
    })
  ),
  async (c) => {
    const id = Number(c.req.param("id")); // ถ้า error ใช้ c.req.param("id") หรือ c.req.param?.("id") ตามเวอร์ชัน
    if (isNaN(id)) {
      return c.json({ error: "Invalid id parameter" }, 400);
    }

    const { studentId, firstName, lastName, birthDate, gender } = c.req.valid("json");

    // แปลง birthDate
    const formattedDate = `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}`;

    const updated = await drizzle
      .update(students)
      .set({
        studentId,
        firstName,
        lastName,
        birthDate: formattedDate,
        gender,
      })
      .where(eq(students.id, id))
      .returning();

    if (updated.length === 0) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json({ success: true, student: updated[0] });
  }
);

studentsRouter.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await drizzle.delete(students).where(eq(students.id, id)).returning();
  if (deleted.length === 0) {
    return c.json({ error: "Student not found" }, 404);
  }
  return c.json({ success: true, students: deleted[0] });
});

export default studentsRouter;
