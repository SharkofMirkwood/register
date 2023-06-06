import { t, Trans } from '@lingui/macro'
import Help from 'components/help'
import IconInfo from 'components/info-icon'
import useRToken from 'hooks/useRToken'
import useTokenStats from 'hooks/useTokenStats'
import { useAtomValue } from 'jotai'
import {
  estimatedApyAtom,
  rsrExchangeRateAtom,
  rTokenAtom,
  rTokenBackingDistributionAtom,
  rTokenConfigurationAtom,
} from 'state/atoms'
import { Box, BoxProps, Flex, Grid, Image, Text } from 'theme-ui'
import { formatCurrency, formatPercentage, parseDuration } from 'utils'

const ExchangeRate = (props: BoxProps) => {
  const rate = useAtomValue(rsrExchangeRateAtom)
  const rToken = useAtomValue(rTokenAtom)

  return (
    <Box variant="layout.borderBox" {...props} padding={4}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          1 {rToken?.stToken?.symbol ?? 'stRSR'} = {rate} RSR
        </Text>
      </Flex>
    </Box>
  )
}

const Stats = (props: BoxProps) => {
  const { stakers } = useAtomValue(estimatedApyAtom)
  const distribution = useAtomValue(rTokenBackingDistributionAtom)
  const params = useAtomValue(rTokenConfigurationAtom)
  const rToken = useRToken()
  const stats = useTokenStats(rToken?.address.toLowerCase() ?? '')

  return (
    <Box {...props} variant="layout.borderBox" p={0}>
      <Grid gap={0} columns={2}>
        <Box
          p={4}
          sx={{
            borderRight: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'border',
          }}
        >
          <Box
            mb={3}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text mr={2} variant="subtitle">
              <Trans>Stake pool</Trans>
            </Text>
          </Box>
          <IconInfo
            icon={<Image src="/svgs/trendup.svg" />}
            title={t`Total RSR staked`}
            text={`${formatCurrency(stats.staked)}`}
          />
        </Box>
        <Box p={4} sx={{ borderBottom: '1px solid', borderColor: 'border' }}>
          <Box variant="layout.verticalAlign" mb={3}>
            <Text mr={2} variant="subtitle">
              <Trans>Est. Staking APY</Trans>
            </Text>
            <Help content="Manually estimated APY base on basket averaged yield, Calculation = [avgCollateralYield * rTokenMarketCap / rsrStaked]" />
          </Box>

          <IconInfo
            icon={<Image src="/svgs/trendup.svg" />}
            title={t`Current`}
            text={formatPercentage(stakers || 0)}
          />
        </Box>
        <Box p={4} sx={{ borderRight: '1px solid', borderColor: 'border' }}>
          <Text mr={2} variant="subtitle" mb={3}>
            <Trans>Unstaking Delay</Trans>
          </Text>

          <IconInfo
            icon={<Image src="/svgs/backing.svg" />}
            title={t`Current`}
            text={parseDuration(+params?.unstakingDelay || 0)}
          />
        </Box>
        <Box p={4} sx={{ borderBottom: '1px solid', borderColor: 'border' }}>
          <Text variant="subtitle" mb={3}>
            <Trans>Backing + Staked</Trans>
          </Text>
          <IconInfo
            icon={<Image src="/svgs/staked.svg" />}
            title={t`Current`}
            text={`${
              (distribution?.backing ?? 0) + (distribution?.staked ?? 0)
            }%`}
          />
        </Box>
      </Grid>
    </Box>
  )
}

const About = (props: BoxProps) => (
  <Box variant="layout.borderBox" p={4} {...props}>
    <Text variant="strong" mb={2}>
      <Trans>Staking RSR</Trans>
    </Text>
    <Text as="p" variant="legend">
      <Trans>
        When staking RSR, you are putting your RSR at risk in the case of a
        collateral default in exchange for 1) the rights to govern the RToken
        and 2) for a portion of the revenue generated by the collateral. The
        revenue sent to the staked RSR pool will be distributed amongst RSR
        stakers proportionally to their stake in the pool.
      </Trans>
    </Text>
    <Text variant="strong" mb={2} mt={4}>
      <Trans>Mechanics</Trans>
    </Text>
    <Text as="p" variant="legend">
      <Trans>
        When you stake your RSR, you will receive a stRSR receipt token which
        represents your ownership in the staked RSR contract. As revenue is
        distributed, the receipt token will be redeemable for an increasing
        amount of RSR. If there is a default scenario where the staked RSR is
        slashed, then the receipt token will be redeemable for a decreased
        amount of RSR.
      </Trans>
    </Text>
    <Text variant="strong" mb={2} mt={4}>
      <Trans>Unstaking RSR</Trans>
    </Text>
    <Text as="p" variant="legend">
      <Trans>
        When you unstake your stRSR, there will be a delay (defined by
        governance). This is to eliminate game theory scenarios that would make
        the backstop RSR staked pool less effective because people would
        continually be incentivized to unstake and restake.
      </Trans>
    </Text>
    <Text variant="strong" mb={2} mt={4}>
      <Trans>Risk evaluation</Trans>
    </Text>
    <Text as="p" variant="legend">
      <Trans>
        Please carefully evaluate the RToken before choosing to stake your RSR
        here. If any of the various collaterals of this RToken default, then the
        staked RSR will be the first funds that get auctioned off to make up the
        difference for RToken holders.
      </Trans>
    </Text>
  </Box>
)

const Overview = (props: BoxProps) => {
  return (
    <Box {...props}>
      <ExchangeRate />
      <Stats mt={[3, 4]} />
      <About mt={[3, 4]} />
    </Box>
  )
}

export default Overview
