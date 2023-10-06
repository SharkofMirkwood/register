import { gql } from 'graphql-request'
import useQuery from 'hooks/useQuery'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { AccountPosition, AccountToken } from 'types'
import useTimeFrom from 'hooks/useTimeFrom'
import { TIME_RANGES } from 'utils/constants'
import RSV from 'utils/rsv'
import { getAddress, trim } from 'viem'
import {
  accountHoldingsAtom,
  accountPositionsAtom,
  accountRTokensAtom,
  accountTokensAtom,
  isSmartWalletAtom,
  rsrPriceAtom,
  walletAtom,
} from '../../atoms'
import { usePublicClient } from 'wagmi'
import { getBytecode } from 'viem/_types/actions/public/getBytecode'

// TODO: Include RSV hardcoded into the query and check for balance
const accountQuery = gql`
  query getAccountTokens($id: String!, $fromTime: Int!, $rsvAddress: String!) {
    account(id: $id) {
      id
      balances(where: { token: $rsvAddress }) {
        amount
        token {
          lastPriceUSD
        }
      }
      rTokens {
        id
        governance {
          tokenBalance
        }
        rToken {
          id
          rsrExchangeRate
          rewardToken {
            token {
              name
              symbol
            }
          }
        }
        balance {
          amount
          token {
            name
            symbol
            lastPriceUSD
          }
        }
      }
    }
  }
`

const AccountUpdater = () => {
  const account = useAtomValue(walletAtom)
  const rsrPrice = useAtomValue(rsrPriceAtom)
  const fromTime = useTimeFrom(TIME_RANGES.MONTH)
  const client = usePublicClient()

  const updateTokens = useSetAtom(accountTokensAtom)
  const updatePositions = useSetAtom(accountPositionsAtom)
  const updateHoldings = useSetAtom(accountHoldingsAtom)
  const updateAccountTokens = useSetAtom(accountRTokensAtom)
  const updateIsSmartWallet = useSetAtom(isSmartWalletAtom)

  const { data, error } = useQuery(account ? accountQuery : null, {
    id: account?.toLowerCase(),
    fromTime,
    rsvAddress: RSV.address.toLowerCase(),
  })

  // TODO: Move this code to a independent function outside of component
  useEffect(() => {
    if (data && !error) {
      const tokens: AccountToken[] = []
      const positions: AccountPosition[] = []
      const accountRTokens: {
        address: string
        name: string
        symbol: string
      }[] = []
      let holdings = 0

      for (const rToken of data?.account?.rTokens || []) {
        const balance = Number(rToken?.balance?.amount)
        const stake = rToken?.governance?.length
          ? Number(rToken.governance[0].tokenBalance)
          : 0
        let tokenApy = 0
        let stakingApy = 0

        // Relate RToken to account
        if (balance > 0 || stake > 0) {
          accountRTokens.push({
            address: getAddress(rToken.rToken.id),
            name: rToken.balance.token.name,
            symbol: rToken.balance.token.symbol,
          })
        }

        if (balance > 0) {
          const usdAmount = Number(rToken.balance.token.lastPriceUSD) * balance
          holdings += usdAmount

          tokens.push({
            address: getAddress(rToken.rToken.id),
            name: rToken.balance.token.name,
            symbol: rToken.balance.token.symbol,
            usdPrice: Number(rToken.balance.token.lastPriceUSD),
            usdAmount,
            balance,
            apy: +tokenApy.toFixed(2),
          })
        }

        if (stake > 0) {
          const rate = Number(rToken.rToken.rsrExchangeRate)
          const rsrAmount = stake * rate
          const usdAmount = rsrAmount * rsrPrice
          holdings += usdAmount

          positions.push({
            name: rToken.rToken.rewardToken.token.name,
            symbol: rToken.rToken.rewardToken.token.symbol,
            balance: stake,
            apy: +stakingApy.toFixed(2),
            exchangeRate: rate,
            rsrAmount,
            usdAmount,
          })
        }
      }

      // Check if the account has RSV balance
      if (data?.account?.balances?.length) {
        const balance = Number(data.account.balances[0]?.amount)
        const usdPrice =
          Number(data.account.balances[0]?.token.lastPriceUSD) || 1

        if (balance > 0) {
          holdings += balance * usdPrice

          tokens.push({
            address: RSV.address,
            name: 'Reserve',
            symbol: 'RSV',
            usdPrice,
            usdAmount: balance * usdPrice,
            balance,
            apy: 0,
          })
        }
      }

      tokens.sort((a, b) => b.usdAmount - a.usdAmount)
      positions.sort((a, b) => b.usdAmount - a.usdAmount)

      const checkSmartWallet = async () => {
        const walletByteCode = await client.getBytecode({ address: account! })
        if (!walletByteCode || trim(walletByteCode) == '0x') {
          updateIsSmartWallet(false)
        } else {
          updateIsSmartWallet(true)
        }
      }
      checkSmartWallet()
      updateTokens(tokens)
      updatePositions(positions)
      updateHoldings(holdings)
      updateAccountTokens(accountRTokens)
    }
  }, [data])

  return null
}

export default AccountUpdater
