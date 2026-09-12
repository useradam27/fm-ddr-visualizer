import { toArray } from '../utils'
 

export function parseRelationships(root) {
  const occurrences = {}
  const relationships = []
 
  const graph = root.RelationshipGraph
  if (!graph) return { occurrences, relationships }
 
  toArray(graph.TableList?.Table).forEach(el => {
    const id = el['@_id']
    occurrences[id] = {
      id,
      name: el['@_name'],
      baseTable: el['@_baseTable'] || el['@_baseTableName'] || '',
    }
  })
 
  toArray(graph.RelationshipList?.Relationship).forEach(relEl => {
    const joinConditions = []
 
    toArray(relEl.JoinPredicateList?.JoinPredicate).forEach(jp => {
      const left  = jp.LeftField?.Field
      const right = jp.RightField?.Field
      joinConditions.push({
        type:       jp['@_type'] || 'Equal',
        leftTable:  left?.['@_table']  || '',
        leftField:  left?.['@_name']  || '',
        rightTable: right?.['@_table'] || '',
        rightField: right?.['@_name'] || '',
      })
    })
 
    const leftTable = relEl.LeftTable
 
    relationships.push({
      id:              relEl['@_id'],
      leftOccurrence:  leftTable?.['@_name'] || '',
      rightOccurrence: relEl.RightTable?.['@_name'] || '',
      joinConditions,
      allowCreate: leftTable?.['@_cascadeCreate'] === 'True',
      allowDelete: leftTable?.['@_cascadeDelete'] === 'True',
    })
  })
 
  return { occurrences, relationships }
}
