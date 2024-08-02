import Help from 'components/help'
import { useAtomValue } from 'jotai'
import { ReactNode } from 'react'
import { Database } from 'react-feather'
import Skeleton from 'react-loading-skeleton'
import { rTokenBackingDistributionAtom } from 'state/atoms'
import { Box, BoxProps, Text } from 'theme-ui'

interface ProgressBarProps {
  percentage: number
  foregroundText?: ReactNode
  backgroundText?: ReactNode
  height?: number
  width?: number | string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  foregroundText,
  backgroundText,
  height = 40,
  width = '100%',
}) => {
  const shouldTextBeOnForeground = percentage >= 40

  return (
    <Box
      sx={{
        position: 'relative',
        height,
        width,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'black',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: 'black',
          transition: 'width 0.5s ease-in-out',
          position: 'relative',
        }}
      >
        {!shouldTextBeOnForeground && (
          <Text
            sx={{
              position: 'absolute',
              top: '50%',
              right: 3,
              transform: 'translateY(-50%)',
              color: 'white',
              fontSize: 1,
              fontWeight: 'bold',
            }}
          >
            {`${percentage}%`}
          </Text>
        )}
      </Box>
      {foregroundText && (
        <Text
          sx={{
            position: 'absolute',
            top: '50%',
            left: shouldTextBeOnForeground
              ? `${percentage}%`
              : `${percentage}%`,
            transform: shouldTextBeOnForeground
              ? 'translate(-100%, -50%)'
              : 'translateY(-50%)',
            color: shouldTextBeOnForeground ? 'white' : 'text',
            fontSize: 1,
            paddingLeft: shouldTextBeOnForeground ? 2 : 2,
            paddingRight: shouldTextBeOnForeground ? 3 : 2,
            whiteSpace: 'nowrap',
          }}
        >
          {foregroundText}
          {shouldTextBeOnForeground && (
            <>
              <Text sx={{ mx: 2 }}>|</Text>
              <Text
                sx={{
                  color: 'white',
                  fontSize: 1,
                  fontWeight: 'bold',
                }}
              >
                {`${percentage}%`}
              </Text>
            </>
          )}
        </Text>
      )}
      {backgroundText && (
        <Text
          sx={{
            position: 'absolute',
            top: '50%',
            right: 3,
            transform: 'translateY(-50%)',
            color: 'black',
            fontSize: 1,
          }}
        >
          {backgroundText}
        </Text>
      )}
    </Box>
  )
}

const BuckingBuffer = ({ ...props }: BoxProps) => {
  const backing = useAtomValue(rTokenBackingDistributionAtom)

  if (!backing) {
    return <Skeleton />
  }

  return (
    <Box px={4} {...props}>
      <Box variant="layout.verticalAlign" sx={{ gap: 2 }}>
        <Database strokeWidth={2} />
        <Text variant="sectionTitle">Backing buffer</Text>
        {/* <Text sx={{ fontSize: 3, opacity: 0.2, mt: 1, mx: 2 }}>|</Text> */}
        <Help content="Collateral yield is distributed as revenue when the backing buffer is full." />
      </Box>
      <Box my={4}>
        <ProgressBar
          percentage={20}
          foregroundText={
            <Text>
              Current value in buffer:{' '}
              <Text sx={{ fontWeight: 'bold' }}>$663,769</Text>
            </Text>
          }
          backgroundText={
            <Text>
              100% at current mcap:{' '}
              <Text sx={{ fontWeight: 'bold' }}>$3,318,848.05</Text>
            </Text>
          }
        />
      </Box>

      <ProgressBar
        percentage={50}
        foregroundText={
          <Text>
            Current value in buffer:{' '}
            <Text sx={{ fontWeight: 'bold' }}>$1,659,424.025</Text>
          </Text>
        }
        backgroundText={
          <Text>
            100% at current mcap:{' '}
            <Text sx={{ fontWeight: 'bold' }}>$3,318,848.05</Text>
          </Text>
        }
      />

      <Box my={4}>
        <ProgressBar
          percentage={80}
          foregroundText={
            <Text>
              Current value in buffer:{' '}
              <Text sx={{ fontWeight: 'bold' }}>$2,655,078.44</Text>
            </Text>
          }
          backgroundText={
            <Text>
              100% at current mcap:{' '}
              <Text sx={{ fontWeight: 'bold' }}>$3,318,848.05</Text>
            </Text>
          }
        />
      </Box>
    </Box>
  )
}

export default BuckingBuffer
