import { AdminRoutes } from "./admin";
import { commonRoutes } from "./common";
import { UserRoutes } from "./user";

function routes(app) {
    UserRoutes(app);
    AdminRoutes(app);
    commonRoutes(app);
}
export { routes };