import React, { FC } from 'react'
import { makeStyles } from '../../../core/utils/theme'

const useStyles = makeStyles()((theme) => ({
  root: {
    marginTop: '1rem',
    maxWidth: '56rem',
  },
  table: {
    overflowX: 'auto',
    margin:'auto',

    '& th, & td': {
      border: `1px solid ${theme.palette.primary.main}`,
    },

    '& th': {
      background: theme.palette.primary.main,
      color: theme.palette.text.secondary,
    },

    '& td': {
      color: theme.palette.text.primary,
    },
  },
}))

export interface ITable {
  columns?: string[]
  data?: any[][]
}
interface IProps {
  data: ITable,
  containerStyle?: string,
  tableStyle?: string,
}
const AnswerTable: FC<IProps> = ({ data, containerStyle, tableStyle }) => {
  const { classes, cx } = useStyles()

  const keys = data.columns

  if (keys == null) {
    return null
  }

  return (
    <div className={cx(classes.root, containerStyle)}>
      <table className={cx(classes.table, tableStyle)}>
        <thead>
          <tr>
            {keys.map((key: string, index: number) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data?.map((row: any[], i: number) => (
            <tr key={i}>
              {row.map((val: string, j: number) => (
                <td key={j}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default AnswerTable
