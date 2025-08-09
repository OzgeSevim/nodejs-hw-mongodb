import setupServer from "./server.js";
import initMongoConnection from "./src/db/ initMongoConnection.js";

setupServer();
initMongoConnection();
