import { DBEntityProperty, EntityProperties } from "../types/propertyTypes"

// Adds a property to a category of the properties object. Creates a category if it doesn't exist.
const addToCategory = (properties: EntityProperties, prop: DBEntityProperty) => {
  if (properties.properties[prop.category]) {
    properties.properties[prop.category][prop.name] = prop.value
  } else {
    properties.properties[prop.category] = {
      [prop.name]: prop.value,
    }
  }
}

export const parseProperties = (properties: DBEntityProperty[], entityId: string): EntityProperties => {
  const entityProperties: EntityProperties = {
    entityId: Number(entityId),
    properties: {},
  }

  properties.forEach((prop: DBEntityProperty) => {
    if (!prop.category.startsWith("__")) {
      addToCategory(entityProperties, prop)
    } else if (prop.name === "name" && prop.category === "__name__") {
      entityProperties.name = prop.value
    }
  })
  return entityProperties
}
