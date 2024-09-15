import React, { FC } from 'react'
import { makeStyles } from '../../../core/utils/theme'

const useStyles = makeStyles()((theme) => ({
  root: {
    marginTop: '1rem',
    maxWidth: '56rem',
  },
  table: {
    overflowX: 'auto',
    minWidth: '100%',

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

interface IProps {
  data: string[][],
  containerStyle?: string,
  tableStyle?: string,
}
const AnswerTable: FC<IProps> = ({ data, containerStyle, tableStyle }) => {
  const { classes, cx } = useStyles()

  if (data == null || !Array.isArray(data) || data.length === 0) {
    return null
  }

  const keys = Object.keys(data[0])

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
          {data.map((row: any, index: number) => (
            <tr key={index}>
              {keys.map((key: string, index2: number) => (
                <td key={index2}>{String(row[key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default AnswerTable
