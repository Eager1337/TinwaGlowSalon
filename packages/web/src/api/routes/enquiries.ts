import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { desc, eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import { enquiries as table } from "../database/schema";
import { auth } from "../auth";

const owner = base.use(async ({ context, next }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session) throw new ORPCError("UNAUTHORIZED");
  const owners = (process.env.OWNER_EMAILS || "").split(",").map((s) => s.trim().toLowerCase());
  if (!owners.includes(session.user.email.toLowerCase()))
    throw new ORPCError("FORBIDDEN", {
      message: "This account has not been approved as a salon owner.",
    });
  return next({ context: { user: session.user } });
});

const services = [
  "Hair styling",
  "Manicure & pedicure",
  "Massage & relaxation",
  "Facial & skincare",
  "Men’s grooming",
  "Makeup & occasion styling",
];
const limits = new Map<string, number[]>();
export const enquiries = {
  create: base
    .input(
      z.object({
        name: z.string().trim().min(2).max(100),
        phone: z
          .string()
          .trim()
          .regex(/^\+?[\d\s()-]{7,20}$/),
        service: z.string().refine((s) => services.includes(s)),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        time: z.enum(["Morning", "Afternoon", "Evening"]),
        notes: z.string().trim().max(500),
        consent: z.literal(true),
        website: z.string().max(0),
      }),
    )
    .handler(async ({ input, context }) => {
      const today = new Date().toISOString().slice(0, 10);
      const parsed = new Date(input.date + "T12:00:00Z");
      if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== input.date ||
        input.date < today ||
        parsed.getTime() > Date.now() + 90 * 86400000
      )
        throw new ORPCError("BAD_REQUEST", {
          message: "Choose a valid date within the next 90 days.",
        });
      const key = context.headers.get("x-forwarded-for")?.split(",")[0] || "local";
      const recent = (limits.get(key) || []).filter((t) => Date.now() - t < 600000);
      if (recent.length >= 5)
        throw new ORPCError("TOO_MANY_REQUESTS", {
          message: "Please wait a few minutes or call the salon.",
        });
      if (limits.size > 10000) limits.clear();
      limits.set(key, [...recent, Date.now()]);
      const id = "TG-" + crypto.randomUUID().slice(0, 8).toUpperCase();
      const { consent: _consent, website: _website, ...values } = input;
      await db.insert(table).values({ id, ...values, createdAt: new Date().toISOString() });
      return { id };
    }),
  list: owner.handler(() => db.select().from(table).orderBy(desc(table.createdAt))),
  update: owner
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["New", "Contacted", "Confirmed", "Completed", "Cancelled"]),
      }),
    )
    .handler(async ({ input }) => {
      const rows = await db
        .update(table)
        .set({ status: input.status })
        .where(eq(table.id, input.id))
        .returning();
      if (!rows.length) throw new ORPCError("NOT_FOUND");
      return rows[0];
    }),
};
