import { t } from '@lingui/macro'
import { Modal } from 'components'
import { ModalProps } from 'components/modal'
import { useAtomValue, useSetAtom } from 'jotai'
import { basketNonceAtom, rTokenAssetsAtom } from 'state/atoms'
import { Box, Checkbox, Divider, IconButton, Text } from 'theme-ui'
import {
  customRedeemModalAtom,
  customRedeemNonceAtom,
  redeemNonceAtom,
  redeemQuotesAtom,
} from './atoms'
import { ChevronLeft } from 'react-feather'
import TokenItem from 'components/token-item'
import { formatCurrency } from 'utils'
import { formatUnits } from 'ethers/lib/utils'

interface Props extends Partial<ModalProps> {}

const RedeemNonceModal = ({ onClose, ...props }: Props) => {
  const setNonce = useSetAtom(customRedeemNonceAtom)
  const nonce = useAtomValue(redeemNonceAtom)
  const basketNonce = useAtomValue(basketNonceAtom)
  const setNonceModal = useSetAtom(customRedeemModalAtom)
  const quote = useAtomValue(redeemQuotesAtom)
  const assets = useAtomValue(rTokenAssetsAtom)

  const handleSelection = (nonce: number) => {
    setNonce(nonce)
    setNonceModal(false)
  }

  const handleClose = () => {
    if (onClose) onClose()
    setNonceModal(false)
  }

  return (
    <Modal
      title={t`Choose Redemption Basket`}
      style={{ maxWidth: '420px', backgroundColor: '#F9F8F4' }}
      onClose={handleClose}
      {...props}
    >
      <IconButton
        onClick={() => setNonceModal(false)}
        sx={{ position: 'absolute', left: 16, cursor: 'pointer', top: 24 }}
      >
        <ChevronLeft />
      </IconButton>
      {!!quote &&
        assets &&
        Object.keys(quote).map((quoteNonce, index) => {
          return (
            <Box
              variant="layout.borderBox"
              p={3}
              mt={index ? 3 : 0}
              sx={{ backgroundColor: 'background' }}
            >
              <Box
                variant="layout.verticalAlign"
                sx={{ cursor: 'pointer' }}
                onClick={() => handleSelection(Number(quoteNonce))}
              >
                <Checkbox checked={Number(quoteNonce) === nonce} />
                <Text ml="1">
                  {basketNonce === Number(quoteNonce) ? 'Current' : 'Previous'}{' '}
                  basket
                </Text>
              </Box>
              <Divider my={3} sx={{ borderStyle: 'dashed' }} />
              <Box>
                {Object.keys(quote[quoteNonce]).map((erc20) => (
                  <Box variant="layout.verticalAlign">
                    <TokenItem symbol={assets[erc20].token.symbol} />
                    <Text ml="auto">
                      {formatCurrency(
                        +formatUnits(
                          quote[quoteNonce][erc20].amount,
                          assets[erc20].token.decimals
                        )
                      )}
                    </Text>
                    {!!quote[quoteNonce][erc20].loss && (
                      <Text ml="1" sx={{ color: 'danger' }}>
                        (-{formatCurrency(quote[quoteNonce][erc20].loss)})
                      </Text>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )
        })}
    </Modal>
  )
}

export default RedeemNonceModal