import { toArray } from '../utils'
 
//intentional duplicate from drr version for now, looking into save as xml file and the paths are nearly the same.
//keeping as separate file in case I want to edit further with differences, but this is hust to get things going
export function parseSaxRelationships(root) {
  const occurrences = {}
  const relationships = []
 
  
  if (!root) return { occurrences, relationships }
 
  toArray(root.TableOccurrenceCatalog?.TableOccurrence).forEach(el => {
    const id = el['@_id']
    const c  = el.Color
    const rect = el.CoordRect
    occurrences[id] = {
      id,
      name: el['@_name'],
      baseTable: el.BaseTableSourceReference?.BaseTableReference?.['@_name'] || '',
      color: c ? `rgb(${c['@_red']}, ${c['@_green']}, ${c['@_blue']})` : '',
      position: rect
        ? { x: parseInt(rect['@_left'], 10), y: parseInt(rect['@_top'], 10) }
        : null,
    }
  })
 
  toArray(root.RelationshipCatalog?.Relationship).forEach(relEl => {
    const joinConditions = []
 
    toArray(relEl.JoinPredicateList?.JoinPredicate).forEach(jp => {
      const left  = jp.LeftField?.FieldReference
      const right = jp.RightField?.FieldReferece
      joinConditions.push({
        type:       jp['@_type'] || 'Equal',
        leftTable:  left?.TableOccurrenceReference?.['@_name']  || '',
        leftField:  left?.['@_name']  || '',
        rightTable: right?.TableOccurrenceReference?.['@_name'] || '',
        rightField: right?.['@_name'] || '',
      })
    })
 
    const leftTable = relEl.LeftTable
    const rightTable = relEl.RightTable
 
    relationships.push({
      id:              relEl['@_id'],
      leftOccurrence:  leftTable?.TableOccurrenceReference?.['@_name']  || '',
      rightOccurrence: rightTable?.TableOccurrenceReference?.['@_name'] || '',
      joinConditions,
      allowCreate: leftTable?.['@_allowCreation'] === 'True',
      allowDelete: leftTable?.['@_allowDeletion'] === 'True',
    })
  })
 
  return { occurrences, relationships }
}
