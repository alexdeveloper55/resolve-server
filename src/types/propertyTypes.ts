export interface DBEntityProperty {
  id: number
  entity_id: number
  attribute_id: number
  value_id: number
  name: string
  category: string
  data_type: number
  data_type_context: any
  description: string | null
  display_name: string | null
  flags: number
  display_precision: number
  value: string
}

export interface EntityProperties {
  entityId: number
  name?: string
  properties: {
    [category: string]: {
      [attribute: string]: any
    }
  }
}
