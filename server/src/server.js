import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
<<<<<<< HEAD
<<<<<<< HEAD

async function startServer() {
  try {
    await connectDatabase();
=======
=======
>>>>>>> e91372e (initial commit)
import { ensureAdminUser } from "./services/auth.service.js";
import { initializeDataStore } from "./services/data-store.js";

async function startServer() {
  try {
    await initializeDataStore();
    await connectDatabase();
    await ensureAdminUser();
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)

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
