import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import contactRoutes from "./routes/contacts.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
// import { getAllContacts, getContactById } from "./services/contacts.js";

const setupServer = () => {
  dotenv.config();

  const app = express();
  const PORT = Number(process.env.PORT);

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    }),
  );

  app.get("/", (req, res) => {
    res.json({
      message: "Node.js MongoDB çalışıyor",
      status: true,
      endpoint: {
        contacts: "/contacts",
      },
    });
  });

  //
  // app.get("/contacts", getAllContacts);
  // app.get("/contacts/:id", getContactById);

  // app.get("*", (req, res) => {
  //   res.status(404).json({
  //     message: "Not found",
  //   });
  // });
  app.use("/contacts", contactRoutes);
  app.use("/auth", authRoutes);

  app.use(errorHandler);
  app.use("*", notFoundHandler);

  app.listen(PORT, () => {
    console.log(`“Server is running on port ${PORT}`);
  });
};

export default setupServer;
