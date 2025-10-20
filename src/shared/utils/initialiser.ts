import { useCurrentUser } from "../hooks/useCurrentUser";

export function AppInitializer() {
  useCurrentUser();
  return null;
}
