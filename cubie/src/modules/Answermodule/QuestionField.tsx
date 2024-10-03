import React from 'react';
import { observer } from 'mobx-react'
import { FC, KeyboardEvent } from 'react'
import { error } from '../../core/services/alerts'
import { makeStyles } from '../../core/utils/theme'
import useApp from '../../hooks/useApp'
import { Box, Input } from '@mui/material'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton } from '@mui/material'

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    margin: '12px 0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  inputContainer: {
    margin: '0 auto',
    display: 'flex',
    width: '100%',
    gap: '2rem',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  input: {
    width: '100%',
    background: 'transparent',
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.text.primary,
    outline: 'none',
    '&:disabled': {
      color: '#444',
    },
  },
  micButton: {
    marginLeft: '1%',
  },
  questionsContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: '100%',
    marginTop: '1.2rem',
  },
  questionsMain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  questionInner: {
    marginTop: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '2rem',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '1.5rem',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      gap: '1rem',
    },
  },
  question: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '80px',
    maxHeight: 'max-content',
    cursor: 'pointer',
    border: `1px solid ${theme.palette.text.disabled}`,
    color: theme.palette.text.disabled,
    fontWeight: '400',
    padding: '1rem',

    '&:hover': {
      background: theme.palette.primary.main,
      color: theme.palette.text.secondary,
      // border: `1px solid ${theme.palette.text.secondary}`,
    },

    '& > p': {
      margin: 0,
      textAlign: 'center',
    },
  },
}))

interface IProps {
  onFinish: (value: string) => void
  disabled?: boolean
  [key: string]: any
}
const QuestionField: FC<IProps> = observer(({ onFinish, disabled = false, ...rest }) => {
  const { classes } = useStyles()
  const app = useApp()

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = app.input.trim() || ''
    if (e.key === 'Enter' && value.length > 0) {
      if (app.isInitializing) {
        error('Please wait until tables are loaded')
        return;
      }
      onFinish(value)
    }
  }

  // className='flex justify-center items-center w-full border border-gray-500 px-5 py-2'
  return (
    <Box className={`${classes.root} queryInputField`}>
      <Box className={classes.inputContainer}>
        <div style={{display:'flex', justifyContent: 'center', alignItems: 'center',
          width: '100%', border: "1px solid grey", padding: "2px 5px"
        }}>
          <span style={{ width: '100%', zIndex: 2 }}>
            <Input
              value={app.input}
              onChange={(e) => {
                // Remove all the newlines from the query
                // remove \r and \n for windows/mac osx
                const query = e.target.value.replace(/[\r\n]/gm, ''); 
                app.setInput(query);
              }}
              type="text"
              disableUnderline
              className={classes.input}
              onKeyUp={handleKeyUp}
              multiline={true}
              maxRows={6}
              sx={{
                pointerEvents: disabled ? 'none' : 'auto',
              }}
              disabled={disabled}
              {...rest}
              inputProps={{ className: "data-hj-allow" }}
            />
          </span>

          <Box className={classes.micButton}>
            {!app.isThinking ? (
              null
            ) : (
              <IconButton onClick={() => app.cancelRequestAction()}>
                <FontAwesomeIcon icon={faClose} />
              </IconButton>
            )}
          </Box>
        </div>
      </Box>
    </Box>
  )
})

export default QuestionField
