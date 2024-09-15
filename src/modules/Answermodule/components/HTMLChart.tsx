import React, { useMemo } from 'react'
import { makeStyles } from '../../../core/utils/theme'


export interface HTMLChartProps {
  answerChartHtml: string | null
  isDashboard: boolean
}

const useStyles = makeStyles()(() => ({
  root: {
    width: '100%',
    height: '500px',
    marginTop: '15px',
    border:'1px solid black'
  },
  dashboard: {
    border:'none', 
    width:'100%', 
    height:'500px'
  }
}))

const HTMLChart: React.FC<HTMLChartProps> = ({ answerChartHtml, isDashboard }) => {
  const { classes } = useStyles()

  const chartUrl = useMemo(() => {
    const file = new Blob([answerChartHtml as string], { type: 'text/html' })
    const url = window.URL.createObjectURL(file)
    return url
  }, [answerChartHtml])

  return (
    <div className={isDashboard ? classes.dashboard : classes.root}>
      <iframe src={chartUrl} width={'100%'} height={'100%'} />
    </div>
  )
}

export default HTMLChart
