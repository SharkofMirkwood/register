import styled from '@emotion/styled'
import { Button, NumericalInput } from 'components'
import useDebounce from 'hooks/useDebounce'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { Box, Card, Text } from 'theme-ui'
import { ReserveToken } from 'types'
import { formatCurrency } from 'utils'
import { issueAmountAtom, maxIssuableAtom } from 'views/issuance/atoms'
import ConfirmModal from './ConfirmModal'
import MaxIssuableUpdater from './MaxIssuableUpdater'
import useQuantities from './useQuantities'
import useTokenIssuableAmount from './useTokenIssuableAmount'

const InputContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

/**
 * Issuance
 * Handles issuance, creates the set of transactions that will be later handled by the container
 * @required TransactionManager context
 *
 * @returns React.Component
 */
// TODO: Validations
// TODO: Get max issuable quantity from view function (protocol)
const Issue = ({ data, ...props }: { data: ReserveToken }) => {
  const [amount, setAmount] = useAtom(issueAmountAtom)
  const issuableAmount = useAtomValue(maxIssuableAtom)
  const debouncedValue = useDebounce(amount, 10)
  const [issuing, setIssuing] = useState(false)
  // Update quantities after input change
  useQuantities(data, debouncedValue)

  const isValid = () => {
    const value = Number(amount)
    return value > 0 && value <= issuableAmount
  }

  return (
    <>
      <MaxIssuableUpdater />
      {issuing && (
        <ConfirmModal
          data={data}
          issuableAmount={issuableAmount}
          onClose={() => setIssuing(false)}
        />
      )}
      <Card {...props}>
        <InputContainer m={3}>
          <Text as="label" variant="contentTitle" mb={2}>
            Mint
          </Text>
          <NumericalInput
            id="mint"
            placeholder="Mint amount"
            value={amount}
            onChange={setAmount}
          />
          <Text
            onClick={() => setAmount(issuableAmount.toString())}
            as="a"
            variant="a"
            sx={{ marginLeft: 'auto', marginTop: 1 }}
          >
            Max: {formatCurrency(issuableAmount)}
          </Text>
          <Button
            disabled={!isValid() || issuing}
            mt={2}
            onClick={() => setIssuing(true)}
          >
            + Mint {data.token.symbol}
          </Button>
        </InputContainer>
      </Card>
    </>
  )
}

export default Issue
