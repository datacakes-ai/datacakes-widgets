import React, { FC, ReactNode } from 'react'
import Modal from 'react-modal'
import { makeStyles } from '../../../core/utils/theme'

const useStyles = makeStyles()((theme) => ({
  root: {
    // minHeight: 600,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    width: '100%',
    borderBottom: `1px solid ${theme.palette.text.disabled}`,
    paddingLeft: 10,
    paddingRight: 10,
    background: 'transparent',
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.text.primary,
    outline: 'none',

    '&:disabled': {
      color: theme.palette.text.disabled,
    },
  },
  contentContainer: {
    // padding: '0rem 1.5rem',
    marginBottom: '1rem',
    display: 'flex',
    width: '100%'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '2%',
    gap: 5
  },
  button: {
    alignSelf: 'center',
    textTransform: 'uppercase',
    padding: '0.5rem 1.5rem',
    minWidth: '8rem'
  },
  rightPanel: {
    paddingTop: '0.4rem',
  }
}))
interface IProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}
const AnswerChartModal: FC<IProps> = ({ open = false, onClose, title, children }) => {
  const { classes } = useStyles();
  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel={title}
      closeTimeoutMS={700}
      shouldCloseOnEsc={true}
      overlayClassName={
        'backdrop-blur-[8px] fixed top-0 h-full w-full flex flex-col justify-center items-center z-10'
      }
      className={`static w-[95%] xl:w-[70%] bg-white px-6 py-4 border border-black mx-4`}
    >
      <div className={classes.root}>
        <div className={classes.contentContainer}>{children}</div>
      </div>
    </Modal>
  )
}

export default AnswerChartModal
