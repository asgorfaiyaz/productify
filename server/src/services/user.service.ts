import { eq } from "drizzle-orm";
import { UserRole, UsersTable } from "../db/schema.js";
import db from "../db/index.js";
import { clerkClient } from "@clerk/express";
import { syncClerkMetaData } from "./clerk.service.js";

export const insertUser = async (data: typeof UsersTable.$inferInsert) => {
  const [user] = await db.insert(UsersTable).values(data).returning();
  return user;
};
export async function updateUser(
  clerkId: string,
  data: Partial<typeof UsersTable.$inferInsert>,
) {
  const [updatedUser] = await db
    .update(UsersTable)
    .set({
      email: data.email,
      name: data.name,
      imageUrl: data.imageUrl,
      role: data.role,
    })
    .where(eq(UsersTable.clerkId, clerkId))
    .returning();

  return updatedUser;
}
export const deleteUser = async (clerkId: string) => {
  const [deletedUser] = await db
    .update(UsersTable)
    .set({
      deletedAt: new Date(),
    })
    .where(eq(UsersTable.clerkId, clerkId))
    .returning();
  await clerkClient.users.deleteUser(clerkId);

  return deletedUser;
};

export const upsertUser = async (data: typeof UsersTable.$inferInsert) => {
  const [user] = await db
    .insert(UsersTable)
    .values(data)
    .onConflictDoUpdate({
      target: UsersTable.clerkId,
      set: {
        email: data.email,
        name: data.name,
        role: data.role,
        imageUrl: data.imageUrl,
      },
    })
    .returning();
  return user;
};

export const createUserFromDashboard = async ({
  firstName,
  lastName,
  email,
  role,
}: {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}) => {
  try {
    const user = await clerkClient.users.createUser({
      firstName,
      lastName,
      emailAddress: [email],
      password: "Faiy2006",
    });

    const newUser = await upsertUser({
      clerkId: user.id,
      email,
      name: `${user.firstName} ${user.lastName}`,
      role,
    });

    await syncClerkMetaData(user.id, newUser);

    return newUser;
  } catch (error: any) {
    // Optional: cleanup Clerk user if DB fails
    console.error("❌ createUserFromDashboard failed:", error);

    if (error?.clerkUserId) {
      await clerkClient.users.deleteUser(error.clerkUserId);
    }
    // Preserve meaningful message
    throw new Error(
      error?.errors?.[0]?.message || error?.message || "Failed to create user",
    );
  }
};

export const getClerkIdByUserId = async (id: string) => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.id, id),
    columns: {
      clerkId: true,
    },
  });
  if (!user) throw new Error("failed to fetch clerk id by user id");
  return user.clerkId;
};
