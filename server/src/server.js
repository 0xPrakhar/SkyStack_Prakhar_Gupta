import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { ensureAdminUser } from "./services/auth.service.js";
import { initializeDataStore } from "./services/data-store.js";

async function startServer() {
  try {
    await connectDatabase();
    await initializeDataStore();
    await ensureAdminUser();

    app.listen(env.port, () => {
      console.info(`Server listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server.");
    console.error(error);
    process.exit(1);
  }
}

startServer();
