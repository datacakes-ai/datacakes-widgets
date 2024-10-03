import React, { FC, MouseEvent } from 'react'
import { Box } from '@mui/material'
import 'chart.js/auto'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2'
import theme, { makeStyles } from '../../../core/utils/theme'
import { IChartData } from '../../../core/types/code_service/IChartData'

const useStyles = makeStyles()(() => ({
  root: {
    marginTop: '2rem',
    flex: 1,
    // height: '35vh',
    width: '70vw',
    position:'relative',
  },
}))

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

interface IProps {
  data: IChartData
  onClick?: () => void
  isFullScreen?: boolean
  fullWidth?: boolean
  isDashboard?: boolean
}
const AnswerChart: FC<IProps> = ({ data, onClick, isFullScreen = false, fullWidth = false, isDashboard = false }) => {
  const { classes } = useStyles()

  if (data == null || Object.keys(data).length === 0) {
    return null
  }

  const tableData = {
    labels: data.x,
    datasets: [
      {
        label: data.y_label,
        data: data.y,
        // backgroundColor: 'rgb(30,121,141)',
        backgroundColor: theme.palette.primary.main,
        borderWidth: 1,
      },
    ],
  }

  const renderChart = () => {
    const chartProps = {
      responsive: true,
      maintainAspectRatio : false,
      options,
      data: tableData,
      style: !isFullScreen && !isDashboard
        ? {
            cursor: 'pointer',
          //borderRadius: '0.75rem',
            border: `1px solid ${theme.palette.primary.main}`,
            padding: '0.75rem',
          }
        : undefined,
    }
    switch (data.type) {
      case 'bar':
        return <Bar {...chartProps} />
      case 'line':
        return <Line {...chartProps} />
      case 'pie':
        return <Pie {...chartProps} />
      case 'doughnut':
        return <Doughnut {...chartProps} />
      default:
        return <></>
    }
  }

  return (
    <Box
      className={`${classes.root}  ${isDashboard ? 'w-[50rem]' : fullWidth ? 'md:w-[50vh] lg:w-[30vh] xl:h-[65vh] md:h-[35vh] h-auto' : 'max-w-[48rem] lg:h-[18vh] xl:h-[40vh]'}`}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (onClick) {
          onClick()
        }
      }}
    >
      {renderChart()}
    </Box>
  )
}
export default AnswerChart
