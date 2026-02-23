export {};

declare global {
  interface CustomJwtSessionClaims {
    dbId?: string;
    role?: "user" | "admin";
  }
  interface UserPublicMetadata {
    dbId?: string;
    role?: UserRole;
  }
}
