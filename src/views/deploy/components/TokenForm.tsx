import { t, Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { Card } from 'components'
import { useEffect } from 'react'
import { Box, Text, BoxProps, Divider } from 'theme-ui'
import Field from './Field'

const TokenForm = (props: BoxProps) => {
  const { account } = useWeb3React()

  useEffect(() => {}, [account])

  return (
    <Card p={4} {...props}>
      <Box p={1} pb={2}>
        <Text sx={{ fontSize: 3 }}>
          <Trans>RToken Details</Trans>
        </Text>
      </Box>
      <Divider mx={-4} mb={3} />
      <Field
        label={t`Token name`}
        placeholder={t`Input token name`}
        onChange={() => {}}
        value=""
        help={t`Test`}
        mb={3}
      />
      <Field
        label={t`Ticker`}
        placeholder={t`Input ticker`}
        onChange={() => {}}
        value=""
        help={t`Test`}
        mb={3}
      />
      <Field
        label={t`Ownership address`}
        placeholder={t`Input ownership address`}
        onChange={() => {}}
        value=""
        help={t`Test`}
      />
    </Card>
  )
}

export default TokenForm