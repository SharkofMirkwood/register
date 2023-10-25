import { Web3Provider } from '@ethersproject/providers'
import {
  Universe,
  baseConfig,
  createDefillama,
  createKyberswap,
  ethereumConfig,
  setupBaseZapper,
  setupEthereumZapper,
} from '@reserve-protocol/token-zapper'
import { atom } from 'jotai'
import { loadable } from 'jotai/utils'

import mixpanel from 'mixpanel-browser'
import { chainIdAtom } from 'state/atoms'
import { publicClient } from 'state/chain'
import { onlyNonNullAtom, simplifyLoadable } from 'utils/atoms/utils'
import { ChainId } from 'utils/chains'
import { PublicClient } from 'viem'

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain } = publicClient
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  }
  return new Web3Provider(async (method, params) => {
    return publicClient.request({
      method,
      params,
    } as any)
  }, network)
}

const providerAtom = atom((get) => {
  const chainId = get(chainIdAtom)
  const cli = publicClient({ chainId })

  return publicClientToProvider(cli) as Web3Provider
})

// TODO: Convert provider viem -> ethers
export const connectionName = onlyNonNullAtom((get) => {
  return get(providerAtom).connection.url
})

const PERMIT2_SUPPORTED_CONNECTIONS = new Set(['metamask'])

export const supportsPermit2Signatures = onlyNonNullAtom((get) => {
  return PERMIT2_SUPPORTED_CONNECTIONS.has(get(connectionName))
})

export const zapperState = loadable(
  atom(async (get) => {
    const chainId = get(chainIdAtom)
    const provider = get(providerAtom)

    // To inject register data into the zapper initialize code, it's probably best to load it all here.
    // Makre sure that thedata does not change after this point as we don't want to trigger updates

    if (provider == null) {
      return null
    }
    provider.on('error', () => {})

    try {
      const chainIdToConfig: Record<
        number,
        { config: any; setup: (uni: Universe<any>) => Promise<any> }
      > = {
        [ChainId.Mainnet]: {
          config: ethereumConfig,
          setup: setupEthereumZapper,
        },
        [ChainId.Base]: {
          config: baseConfig,
          setup: setupBaseZapper,
        },
      }

      const universe = await Universe.createWithConfig(
        provider,
        chainIdToConfig[chainId].config,
        chainIdToConfig[chainId].setup
      )

      universe.dexAggregators.push(createKyberswap('KyberSwap', universe, 50))

      if (chainId === ChainId.Mainnet) {
        universe.dexAggregators.push(
          createDefillama('DefiLlama:0x', universe, 10, 'Matcha/0x')
        )
        universe.dexAggregators.push(
          createDefillama('DefiLlama:HashFlow', universe, 10, 'Hashflow')
        )
      } else if (chainId === ChainId.Base) {
        universe.dexAggregators.push(
          createDefillama('DefiLlama:0x', universe, 10, 'Matcha/0x')
        )
      }
      return universe
    } catch (e) {
      console.log('Zap init error', e)
      mixpanel.track('Failed zapper set up', {
        ChainId: provider.network.chainId,
      })
      return null
    }
  })
)

export const resolvedZapState = simplifyLoadable(zapperState)
export const zapperLoaded = atom(async (get) => {
  const zapper = get(resolvedZapState)
  if (zapper == null) {
    return false
  }
  await zapper.initialized
  return true
})

export const zappableTokens = atom(async (get) => {
  const uni = get(resolvedZapState)

  if (uni == null) {
    return []
  }
  return [
    uni.nativeToken,
    uni.commonTokens.USDbC,
    uni.commonTokens.USDC,
    uni.commonTokens.USDT,
    uni.commonTokens.DAI,
    uni.commonTokens.WBTC,
    uni.commonTokens.WETH,
    uni.commonTokens.MIM,
    uni.commonTokens.FRAX,
  ].filter((tok) => tok != null)
})
