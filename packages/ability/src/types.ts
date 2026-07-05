export type Role = "admin" | "user";
export type Subjects = "Product" | "Review" | "Order" | "User" | "all";
export type Actions = "create" | "read" | "update" | "delete" | "manage";

export type JwtPayloadCASL = {
  id: string;
  role: Role;
  exp: number;
};
