import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { Role } from "./types.js";

export function defineAbilitiesFor(user: { id: string; role: Role }) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === "admin") {
    can("manage", "all");
  }

  if (user.role === "user") {
    can("read", "Product");
    can("create", "Review");
    can("read", "Order", { user: user.id });
    can("create", "Order", { user: user.id });
    can("update", "User", { _id: user.id });
  }

  return build();
}
