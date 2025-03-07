import React, { useRef } from 'react'
import { sanitize } from 'isomorphic-dompurify'
import { FC, useState } from 'react'
import AnswerTable, { ITable } from './components/AnswerTable'
import { observer } from 'mobx-react'
import HTMLChart from './components/HTMLChart'
import AnswerChartModal from './components/AnswerChartModal'
import AnswerChart from './components/AnswerChart'
import { IChartData } from '../../core/types/code_service/IChartData'
import { makeStyles } from '../../core/utils/theme'

const useStyles = makeStyles()((theme:any) => ({
  root: {
    height: '100%',
    marginBottom: '1rem',
    width: '100%',
    flexGrow: 1,
    fontFamily: 'Inconsolata, monospace',
    maxHeight: '0vh',
  },
  answerText: {
    textAlign: 'left',
    fontSize: '1.2rem',
  },
  feedbackControl: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '1.5rem',
    marginTop: "10px",
    marginBottom: "10px",

    '& > span': {
      fontSize: '1.2rem',
      color: theme.palette.text.primary,
    },
  },
  buttonContainer: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    alignSelf: 'center',
    textTransform: 'uppercase',
    padding: '0.5rem 1.5rem',
  },
  tableContainer: {
    display: 'block',
    maxWidth: '100%',
  },
  table: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: 500,
  },
  icon: {
    width: 24,
    height: 24,
  }
}))

interface IProps {
  answerStr: string
  answerData: ITable
  answerChartData: IChartData
  answerChartHtml: string | null
  answerInsight?: string | null
  answerRecommendation?: string|null
  isDashboard?: boolean
}

enum ModalType {
  CHART,
  DATA
}

const AnswerSection: FC<IProps> = observer(({ answerStr, answerData, answerChartData, answerChartHtml, answerInsight=null, answerRecommendation=null, isDashboard = false }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleClick = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  const { classes, cx } = useStyles()
  const ansDiv = useRef<HTMLDivElement>(null)
  const [modalType] = useState<ModalType>(ModalType.CHART);

  // Get reference to settings store
  const getContent = () => {
    if (modalType === ModalType.CHART) {
      if (answerChartHtml) return <HTMLChart answerChartHtml={answerChartHtml} isDashboard={isDashboard} />
      else return <AnswerChart fullWidth={true} data={answerChartData} onClick={handleClick} isDashboard={isDashboard}/>
    }

    if (modalType === ModalType.DATA) {
      return <AnswerTable containerStyle={classes.tableContainer} tableStyle={classes.table} data={answerData} />
    }
  }

  const newAnswer = (!answerChartHtml && !answerChartData && answerStr.includes(answerData.toString())) ? answerStr.replace(answerData.toString(), `<b>${answerData.toString()}</b>`) : answerStr

  return (
    <div className={classes.root} style={{paddingTop:isDashboard ? '2rem' : '0'}}>
      {!answerChartHtml && !answerChartData &&
      <div
        ref={ansDiv}
        dangerouslySetInnerHTML={{
          __html: sanitize(newAnswer.replace(/\n/g, '<br>').replace(/<code>/g, '<pre><code>').replace(/<\/code>/g, '</code></pre>')),
        }}
        className={`${cx(classes.answerText, 'answerStr')} ${isDashboard ? 'mt-5 px-5' : ''}`}
      />}

      {answerInsight && 
        <div className="p-4">
          {answerInsight}
        </div>
      } 
      {answerRecommendation && 
        <div className="p-4">
          <strong>Recommendation</strong>: {answerRecommendation}
        </div>
      } 
      {answerStr && 
        <div className="p-4">
          <strong>Data</strong>: {answerStr}
        </div>
      }
      {answerChartHtml ? 
         <HTMLChart answerChartHtml={answerChartHtml} isDashboard={isDashboard} />
        : answerChartData ?
        <AnswerChart
          data={answerChartData}
          onClick={handleClick}
          isDashboard={isDashboard}
          />
        : <div></div>
      }

      {isDashboard && 
      <div className="h-[50px]" />
      }
      <AnswerChartModal open={isOpen} onClose={handleClose} title="Answer">
        {getContent()}
      </AnswerChartModal>
      <div className="w-full overflow-auto">
        <AnswerTable data={answerData} />
      </div>
      {/* {!isDashboard &&
        <div className="flex flex-row items-center my-3">
          <div className={classes.feedbackControl}>
            <span>How did I do?</span>
            <FeedbackControl />
          </div>
        </div>
      } */}
    </div>
  )
})

export default AnswerSection
