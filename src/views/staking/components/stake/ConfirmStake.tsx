import { t } from '@lingui/macro'
import StRSR from 'abis/StRSR'
import StRSRVotes from 'abis/StRSRVotes'
import stRSRLegacy from 'abis/stRSRLegacy'
import TransactionModal from 'components/transaction-modal'
import useDebounce from 'hooks/useDebounce'
import useRToken from 'hooks/useRToken'
import { atom, useAtom, useAtomValue } from 'jotai'
import mixpanel from 'mixpanel-browser'
import { useEffect, useMemo, useState } from 'react'
import {
  accountDelegateAtom,
  chainIdAtom,
  isModuleLegacyAtom,
  rTokenContractsAtom,
  walletAtom,
} from 'state/atoms'
import { formatCurrency, safeParseEther } from 'utils'
import { RSR_ADDRESS } from 'utils/addresses'
import { Address } from 'viem'
import { isValidStakeAmountAtom, stakeAmountAtom } from 'views/staking/atoms'
import DelegateStake from './DelegateStake'
import StakeInput from './_StakeInput'

const customDelegateAtom = atom('')

// TODO: Use debounced input
const contractCallAtom = atom((get) => {
  const currentDelegate = get(accountDelegateAtom)
  const amount = get(stakeAmountAtom)
  const contracts = get(rTokenContractsAtom)
  const delegate = get(customDelegateAtom)
  const { staking: isLegacy } = get(isModuleLegacyAtom)
  const isValid = get(isValidStakeAmountAtom)

  if (!contracts || !isValid || !delegate) {
    return undefined
  }

  const parsedAmount = safeParseEther(amount)

  if (!isLegacy && delegate !== currentDelegate) {
    return {
      abi: StRSRVotes,
      address: contracts.stRSR.address,
      functionName: 'stakeAndDelegate',
      args: [parsedAmount, delegate] as [bigint, Address],
    }
  }

  return {
    abi: isLegacy ? stRSRLegacy : StRSR,
    address: contracts.stRSR.address,
    functionName: 'stake',
    args: [parsedAmount] as [bigint],
  }
})

const ConfirmStake = ({ onClose }: { onClose: () => void }) => {
  const [signing, setSigning] = useState(false)
  const call = useDebounce(useAtomValue(contractCallAtom), 250)
  const [amount, setAmount] = useAtom(stakeAmountAtom)
  const rToken = useRToken()
  const account = useAtomValue(walletAtom)
  const { staking: isLegacy } = useAtomValue(isModuleLegacyAtom)
  const currentDelegate = useAtomValue(accountDelegateAtom)
  const [delegate, setDelegate] = useAtom(customDelegateAtom)
  const [isEditingDelegate, setEditingDelegate] = useState(false)
  const chainId = useAtomValue(chainIdAtom)
  const requiredAllowance = useMemo(() => {
    if (!call) return undefined

    return {
      token: RSR_ADDRESS[chainId],
      spender: call.address,
      amount: call.args[0],
      symbol: 'RSR',
      decimals: 18,
    }
  }, [call, chainId])

  useEffect(() => {
    if (currentDelegate !== delegate || !delegate) {
      setDelegate(currentDelegate || account || '')
    }
  }, [currentDelegate])

  const handleClose = () => {
    onClose()
    setAmount('')
  }

  const handleChange = (signing: boolean) => {
    setSigning(signing)
    if (signing) {
      mixpanel.track('Confirmed Stake RSR', {
        RToken: rToken?.address.toLowerCase() ?? '',
      })
    }
  }

  return (
    <TransactionModal
      title={t`Stake RSR`}
      description={`Stake on ${rToken?.symbol}`}
      call={call}
      disabled={isEditingDelegate}
      requiredAllowance={requiredAllowance}
      confirmLabel={t`Begin stake of ${formatCurrency(Number(amount))} RSR`}
      onClose={handleClose}
      onChange={handleChange}
      width="500px"
    >
      <StakeInput compact disabled={signing} />
      {!isLegacy && (
        <DelegateStake
          value={delegate}
          editing={isEditingDelegate}
          onEdit={setEditingDelegate}
          onChange={(delegate) => {
            setEditingDelegate(false)
            setDelegate(delegate)
          }}
        />
      )}
    </TransactionModal>
  )
}

export default ConfirmStake
