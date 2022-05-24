import { LoadingButton } from 'components/button'
import Modal from 'components/modal'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle } from 'react-feather'
import { addTransactionAtom, allowanceAtom } from 'state/atoms'
import { useTransaction } from 'state/web3/hooks/useTransactions'
import { Divider, Flex, Text } from 'theme-ui'
import { BigNumberMap, TransactionState } from 'types'
import { hasAllowance } from 'utils'
import { TRANSACTION_STATUS } from 'utils/constants'
import { v4 as uuid } from 'uuid'
import ApprovalTransactions from './ApprovalTransactions'
import TransactionError from './TransactionError'

export interface ITransactionModal {
  title: string
  children: any
  tx: TransactionState
  requiredAllowance: BigNumberMap
  confirmLabel: string
  approvalsLabel?: string
  buildApprovals?: (
    required: BigNumberMap,
    allowances: BigNumberMap
  ) => TransactionState[]
  onClose: () => void
  onChange?(signing: boolean): void
  isValid: boolean
}

const TransactionConfirmed = ({ onClose }: { onClose(): void }) => (
  <Modal onClose={onClose} style={{ width: '400px' }}>
    <Flex
      p={4}
      sx={{
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <CheckCircle size={36} />
      <br />
      <Text>Transaction signed!</Text>
    </Flex>
  </Modal>
)

const TransactionModal = ({
  title,
  requiredAllowance,
  tx,
  children,
  isValid,
  confirmLabel,
  approvalsLabel,
  buildApprovals,
  onClose,
  onChange = () => {},
}: ITransactionModal) => {
  const addTransaction = useSetAtom(addTransactionAtom)
  const allowances = useAtomValue(allowanceAtom)
  const [signing, setSigning] = useState('')
  const [approvalsTx, setApprovalsTx] = useState([] as TransactionState[])
  const requiredApprovals = useMemo(
    () => approvalsTx.filter((tx) => tx.status === TRANSACTION_STATUS.PENDING),
    [approvalsTx]
  )
  const canSubmit = useMemo(
    () => isValid && hasAllowance(allowances, requiredAllowance),
    [allowances, isValid, requiredAllowance]
  )
  const txState = useTransaction(signing)
  const signed =
    txState?.status === TRANSACTION_STATUS.MINING ||
    txState?.status === TRANSACTION_STATUS.CONFIRMED

  const handleConfirm = () => {
    const id = uuid()
    setSigning(id)
    onChange(true)
    addTransaction([{ ...tx, id }])
  }

  const handleRetry = () => {
    setSigning('')
    onChange(false)
  }

  const fetchApprovals = () => {
    if (
      buildApprovals &&
      Object.keys(allowances).length &&
      Object.keys(requiredAllowance).length
    ) {
      setApprovalsTx(buildApprovals(requiredAllowance, allowances))
    } else {
      setApprovalsTx([])
    }
  }

  useEffect(fetchApprovals, [allowances, requiredAllowance])

  if (signed) {
    return <TransactionConfirmed onClose={onClose} />
  }

  return (
    <Modal title={title} onClose={onClose} style={{ width: '400px' }}>
      {txState?.status === TRANSACTION_STATUS.REJECTED && (
        <TransactionError
          title="Transaction failed"
          subtitle={txState.description}
          onClose={handleRetry}
        />
      )}
      {children}
      {requiredApprovals.length > 0 && !canSubmit && (
        <>
          <Divider mx={-4} mt={3} />
          <ApprovalTransactions
            onConfirm={() => onChange(true)}
            onError={() => {
              onChange(false)
              fetchApprovals()
            }}
            title={approvalsLabel ?? 'Approve'}
            txs={requiredApprovals}
          />
        </>
      )}
      <Divider mx={-4} mt={3} />
      <LoadingButton
        loading={!!signing}
        disabled={!canSubmit}
        variant={!!signing ? 'accent' : 'primary'}
        text={confirmLabel}
        onClick={handleConfirm}
        sx={{ width: '100%' }}
        mt={2}
      />
    </Modal>
  )
}

export default TransactionModal
