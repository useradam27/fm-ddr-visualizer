import { toArray } from '../utils'
 
//intentional duplicate from drr version for now, looking into save as xml file and the paths are nearly the same.
//keeping as separate file in case I want to edit further with differences, but this is hust to get things going
export function parseSaxPrivileges(root) {
    const privilegeSets = {}
 
    const catalog = root.PrivilegeSetsCatalog?.ObjectList
    if (!catalog) return privilegeSets
 
    toArray(catalog.PrivilegeSet).forEach(el => {
        const id = el['@_id']
 
        const tableAccess = {}
        toArray(el.BaseTablePrivilege).forEach(tp => {
            tableAccess[tp['@_name']] = {
                view:   tp['@_viewPrivilege']   || 'no',
                edit:   tp['@_editPrivilege']   || 'no',
                create: tp['@_createPrivilege'] || 'no',
                delete: tp['@_deletePrivilege'] || 'no',
            }
        })
 
        const layoutAccess = {}
        toArray(el.LayoutPrivilege).forEach(lp => {
            layoutAccess[lp['@_name']] = { access: lp['@_access'] || 'no' }
        })
 
        const scriptAccess = {}
        toArray(el.ScriptPrivilege).forEach(sp => {
            scriptAccess[sp['@_name']] = { access: sp['@_access'] || 'no' }
        })
 
        privilegeSets[id] = {
            id,
            name: el['@_name'],
            description: el['@_comment'] || '',
            tableAccess, layoutAccess, scriptAccess,
        }
    })
 
    return privilegeSets
}