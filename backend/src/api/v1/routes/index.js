import { AdminRoutes } from "./admin";
import { UserRoutes } from "./user";

function routes(app) {
    UserRoutes(app);
    AdminRoutes(app);
}
export { routes };