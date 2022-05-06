
import isAuth from "../middlewares/isAuth";
import controllers from "../controllers";


export default function routes(app) {
  app.post("/api/add-online", isAuth, controllers.statusController.addOnline)
  app.post("/api/leave-online", isAuth, controllers.statusController.leaveOnline)
}

