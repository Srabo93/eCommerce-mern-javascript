import type { JwtVariables } from "hono/jwt";
import type { JwtPayloadCASL } from "@proshop/ability";

export type Variables = JwtVariables<JwtPayloadCASL>;
