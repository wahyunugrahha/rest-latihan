import express from "express";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../routes/api.js";
import swaggerUi from 'swagger-ui-express'; 
import YAML from 'yamljs'; 
import path from 'path'; 
const web = express();
web.use(express.json());

// Swagger
const swaggerDocument = YAML.load(path.resolve("docs", "swagger.yaml")); 
web.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
export { web };
