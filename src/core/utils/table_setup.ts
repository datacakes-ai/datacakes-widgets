import { warning } from '../services/alerts'
import { ITableLinkColumnLocal } from '../types/source_service/ITableLinkColumnLocal'
import { ITableLinkLocal } from '../types/source_service/ITableLinkLocal'
import { ITableLink, ITableWithLinks } from '../types/source_service/ITableWithLinks'

export const createLocalTableLink = (
  column1: ITableLinkColumnLocal | null,
  column2: ITableLinkColumnLocal | null,
) => {
  return [column1, column2]
}

export const toLocalTableLink = (
  columns: ITableLinkColumnLocal[],
  sourceTableId: string,
  link: ITableLink,
) => {
  const tableName = columns.find((column) => column.table_id === sourceTableId)?.table_name || ''

  return createLocalTableLink(
    {
      table_id: sourceTableId,
      table_name: tableName,
      column_name: link.column,
    },
    {
      table_id: link.target_table_id,
      table_name: tableName,
      column_name: link.target_column,
    },
  )
}

export const tableLinksToLocalColumns = (tables: ITableWithLinks[]) => {
  const columns: ITableLinkColumnLocal[] = []

  for (let i = 0; i < tables.length; i++) {
    for (let j = 0; j < tables[i].columns.length; j++) {
      if ('is_selected' in tables[i].columns[j]) {
        if (!tables[i].columns[j].is_selected) continue
      }

      if (tables[i].columns[j] == null) {
        continue
      }
      columns.push({
        table_id: tables[i].id,
        table_name: tables[i].name,
        column_name: tables[i].columns[j].name,
      })
    }
  }
  return columns
}

export const tableLinksToLocalLinks = (
  tables: ITableWithLinks[],
  columns: ITableLinkColumnLocal[],
) => {
  const links: (ITableLinkColumnLocal | null)[][] = []

  for (let i = 0; i < tables.length; i++) {
    const existingLinks = tables[i]?.links || []
    if (existingLinks.length == 0) {
      continue
    }

    for (let j = 0; j < existingLinks.length; j++) {
      if (tables.find((table) => table.id === existingLinks[j].target_table_id) == null) {
        continue
      }

      if (links.length > 0) {
        if (
          links.find((link) => link[0]?.table_id === tables[i].id) != null &&
          links.find((link) => link[1]?.table_id === existingLinks[j].target_table_id) != null
        ) {
          continue
        }
      }

      const columnNames = columns.map((col) => `${col.table_name}.${col.column_name}`)

      if (!columnNames.includes(`${tables[i].name}.${existingLinks[j].column}`)) {
        continue
      }

      links.push(toLocalTableLink(columns, tables[i].id, existingLinks[j]))
    }
  }

  return links
}

export const formatTableId = (tableId: string) => {
  return tableId.includes(':') ? tableId.replace(':', ':  ') : tableId
}

/**
 * Validate the relation:
 * 1. fields are not from the same table,
 * 2. such relation does not yet exists.
 *
 * @param column1
 * @param column2
 * @returns
 */
export const validateLocalTableLink = (
  localLinks: (ITableLinkColumnLocal | null)[][],
  column1: ITableLinkColumnLocal | null,
  column2: ITableLinkColumnLocal | null,
): boolean => {
  if (column1 == null || column2 == null) {
    return true
  }

  if (column1.table_id === column2.table_id) {
    warning('Columns should not be from the same table')
    return false
  }

  if (doesLocalTableLinkExist(localLinks, column1, column2)) {
    warning('Such join already exists')
    return false
  }

  return true
}

const areColumnsEqual = (
  column1: ITableLinkColumnLocal | null,
  column2: ITableLinkColumnLocal | null,
) => {
  if (column1 == null || column2 == null) {
    return false
  }

  return column1.table_id === column2.table_id && column1.column_name === column2.column_name
}

/**
 * Check if such relation already exists.
 *
 *
 * @param localLinks
 * @param column1
 * @param column2
 * @returns
 */
const doesLocalTableLinkExist = (
  localLinks: (ITableLinkColumnLocal | null)[][],
  column1: ITableLinkColumnLocal | null,
  column2: ITableLinkColumnLocal | null,
) => {
  return localLinks.some((link: (ITableLinkColumnLocal | null)[]) => {
    if (link[0] == null || link[1] == null) {
      return false
    }

    return (
      (areColumnsEqual(link[0], column1) && areColumnsEqual(link[1], column2)) ||
      (areColumnsEqual(link[0], column2) && areColumnsEqual(link[1], column1))
    )
  })
}

export const findLocalLinkById = (localLinkId: string, localLinks: ITableLinkLocal[]) => {
  return localLinks.find((link: ITableLinkLocal) => link._id === localLinkId)
}

export const areAllLinksComplete = (links: (ITableLinkColumnLocal | null)[][]) => {
  return links.every((link: (ITableLinkColumnLocal | null)[]) => link[0] != null && link[1] != null)
}

export const isLinkEmpty = (link: (ITableLinkColumnLocal | null)[]) => {
  return link.every((column: ITableLinkColumnLocal | null) => column == null)
}
