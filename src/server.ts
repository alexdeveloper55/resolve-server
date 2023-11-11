import express, { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import { checkDatabaseFileExists, downloadDatabaseFile, dbFilePath, getEntityProperties } from "./utils/database"
import { parseProperties } from "./controllers/entityController"

dotenv.config()

const PORT: number = parseInt(process.env.PORT as string, 10) || 4000
const dbUrl = process.env.DATABASE_URL

const cors = require("cors")
const app = express()

app.use(cors())

async function ensureDatabase(_req: Request, res: Response, next: NextFunction) {
  try {
    if (!checkDatabaseFileExists(dbFilePath)) {
      console.log("Database file not found. Downloading now...")
      await downloadDatabaseFile(dbUrl as string, dbFilePath)
    }
    next()
  } catch (error) {
    console.error("Error ensuring database file", error)
    res.status(500).send("Internal Server Error")
  }
}

app.use("/properties/:entityId", ensureDatabase)
app.get("/properties/:entityId", async (req: Request, res: Response) => {
  const id = req.params.entityId
  try {
    const properties = await getEntityProperties(id)

    if (properties.length > 0) {
      const result = parseProperties(properties, id)
      res.json(result)
    } else {
      res.status(404).json({
        message: `Entity with id:${id} was not found.`,
      })
    }
  } catch (error) {
    console.error("Error querying the database", error)
    res.status(500).send("Internal Server Error")
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
