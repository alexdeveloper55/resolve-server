import fs from "fs"
import path from "path"
import axios from "axios"
import sqlite3 from "sqlite3"
import { DBEntityProperty } from "../types/propertyTypes"

// Check if SQLite file exists locally
export const checkDatabaseFileExists = (filepath: string): boolean => {
  return fs.existsSync(filepath)
}

export const dbFilePath = path.join(__dirname, "../../data/props.db")

export const downloadDatabaseFile = async (url: string, outputPath: string): Promise<void> => {
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  })

  const writer = fs.createWriteStream(outputPath)

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve)
    writer.on("error", reject)
  })
}

export const getEntityProperties = async (entityId: string): Promise<DBEntityProperty[]> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        reject(err)
      }
    })

    const sql = `SELECT * 
                      FROM _objects_eav eav 
                      JOIN _objects_attr attr ON eav.attribute_id=attr.id 
                      JOIN _objects_val val ON eav.value_id=val.id
                      WHERE entity_id = ?;`

    db.all(sql, [entityId], (err, rows: DBEntityProperty[]) => {
      db.close()
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}
