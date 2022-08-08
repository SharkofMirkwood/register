import { Trans } from '@lingui/macro'
import { SmallButton } from 'components/button'
import Help from 'components/help'
import { useAtomValue } from 'jotai'
import { useCallback } from 'react'
import { Box, BoxProps, Divider, Flex, Text } from 'theme-ui'
import { backupCollateralAtom, basketAtom } from '../atoms'
import EmergencyCollateral from './EmergencyCollateral'

interface Props extends BoxProps {
  onAdd?(
    data: {
      basket: 'primary' | 'backup'
      targetUnit?: string
    } | null
  ): void
  readOnly?: boolean
}

const Placeholder = () => (
  <Box m={4} ml={2}>
    <Box>
      <Flex variant="layout.verticalAlign">
        <Text variant="title" mr={2}>
          <Trans>Emergency collateral</Trans>
        </Text>
        <SmallButton ml="auto" disabled>
          <Trans>+ Add</Trans>
        </SmallButton>
      </Flex>
      <Flex mt={5} variant="layout.verticalAlign">
        <Text>
          <Trans>Diversity factor</Trans>
        </Text>
        <Box
          sx={{ backgroundColor: 'lightBackground', borderRadius: 16 }}
          ml="auto"
          mr={2}
          px={3}
          py={1}
        >
          <Text>n=0</Text>
        </Box>
        <Help content="TODO" />
      </Flex>
      <Divider my={3} />
      <Box sx={{ textAlign: 'center' }} mt={5}>
        <Text sx={{ fontWeight: 500, display: 'block' }}>
          <Trans>Add Primary first</Trans>
        </Text>
        <Text variant="legend" sx={{ fontSize: 1 }}>
          <Trans>
            Each target unit of your primary basket will have a list of
            emergency collateral to replace with in case of default.
          </Trans>
        </Text>
      </Box>
    </Box>
  </Box>
)

/**
 * View: Deploy -> BasketSetup
 * Show emergency collateral per target unit
 */
const BackupBasket = ({
  onAdd = () => {},
  readOnly = false,
  ...props
}: Props) => {
  const targetUnits = Object.keys(useAtomValue(basketAtom))
  const backupBasket = useAtomValue(backupCollateralAtom)

  const handleAdd = useCallback(
    (targetUnit: string) => {
      onAdd({ basket: 'backup', targetUnit })
    },
    [onAdd]
  )

  if (readOnly && !targetUnits.length) {
    return null
  }

  return (
    <Box {...props}>
      {targetUnits.map((targetUnit) =>
        readOnly && !backupBasket[targetUnit]?.collaterals.length ? null : (
          <EmergencyCollateral
            mb={3}
            readOnly={readOnly}
            onAdd={handleAdd}
            key={targetUnit}
            targetUnit={targetUnit}
            {...backupBasket[targetUnit]}
          />
        )
      )}
      {!targetUnits.length && <Placeholder />}
    </Box>
  )
}

export default BackupBasket
