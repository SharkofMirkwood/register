import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { GovernanceInterface } from 'abis'
import { SmallButton } from 'components/button'
import { formatEther } from 'ethers/lib/utils'
import useBlockNumber from 'hooks/useBlockNumber'
import useRToken from 'hooks/useRToken'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { ArrowLeft } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import { rTokenGovernanceAtom } from 'state/atoms'
import { promiseMulticall } from 'state/web3/lib/multicall'
import { Box, Grid } from 'theme-ui'
import { CHAIN_ID } from 'utils/chains'
import { PROPOSAL_STATES, ROUTES } from 'utils/constants'
import { accountVotesAtom, proposalDetailAtom } from './atom'
import ProposalAlert from './components/ProposalAlert'
import ProposalDetailContent from './components/ProposalDetailContent'
import ProposalDetailStats from './components/ProposalDetailStats'
import ProposalExecute from './components/ProposalExecute'
import ProposalQueue from './components/ProposalQueue'
import ProposalVote from './components/ProposalVote'
import ProposalVotes from './components/ProposalVotes'
import useProposalDetail from './useProposalDetail'

const GovernanceProposalDetail = () => {
  const { proposalId } = useParams()
  const rToken = useRToken()
  const { account, provider, chainId } = useWeb3React()
  const governance = useAtomValue(rTokenGovernanceAtom)
  const { data: proposal, loading } = useProposalDetail(proposalId ?? '')
  const setProposalDetail = useSetAtom(proposalDetailAtom)
  const setAccountVoting = useSetAtom(accountVotesAtom)
  const blockNumber = useBlockNumber()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(`${ROUTES.GOVERNANCE}?token=${rToken?.address}`)
  }

  useEffect(() => {
    if (proposal) {
      setProposalDetail(proposal)
    }
  }, [JSON.stringify(proposal)])

  useEffect(() => {
    return () => {
      setProposalDetail(null)
      setAccountVoting({ votePower: null, vote: null })
    }
  }, [])

  // TODO: Get governor from proposal
  const fetchAccountVotingPower = async () => {
    if (
      account &&
      provider &&
      proposal &&
      !!blockNumber &&
      governance.governor &&
      chainId === CHAIN_ID
    ) {
      try {
        const accountVote = proposal.votes.find(
          (vote) => vote.voter.toLowerCase() === account.toLowerCase()
        )
        let votePower = '0'

        if (!accountVote) {
          const [result] = await promiseMulticall(
            [
              {
                abi: GovernanceInterface,
                method: 'getVotes',
                address: governance.governor,
                args: [
                  account,
                  Math.min(proposal.startBlock - 1, blockNumber - 1),
                ],
              },
            ],
            provider
          )

          votePower = result ? formatEther(result) : '0'
        } else {
          votePower = accountVote.weight
        }

        setAccountVoting({
          votePower,
          vote: accountVote ? accountVote.choice : null,
        })
      } catch (e) {
        console.error('Error fetching voting power', e)
      }
    }
  }

  useEffect(() => {
    fetchAccountVotingPower()
  }, [account, provider, chainId, !!blockNumber && JSON.stringify(proposal)])

  return (
    <Grid
      columns={[1, 1, 1, '2fr 1.5fr']}
      gap={[3, 5]}
      padding={[1, 5]}
      sx={{
        height: '100%',
        position: 'relative',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        overflowY: 'auto',
      }}
    >
      <Box>
        <Box variant="layout.verticalAlign" mb={4}>
          <SmallButton variant="muted" onClick={handleBack}>
            <Box variant="layout.verticalAlign">
              <ArrowLeft size={14} style={{ marginRight: 10 }} />
              <Trans>Back</Trans>
            </Box>
          </SmallButton>
          <ProposalAlert />
          {proposal?.state === PROPOSAL_STATES.SUCCEEDED && <ProposalQueue />}
          {proposal?.state === PROPOSAL_STATES.QUEUED && <ProposalExecute />}
        </Box>
        <ProposalDetailContent />
      </Box>
      <Box>
        {(proposal?.state === PROPOSAL_STATES.PENDING ||
          proposal?.state === PROPOSAL_STATES.ACTIVE) && <ProposalVote />}
        <ProposalDetailStats />
        <ProposalVotes />
      </Box>
    </Grid>
  )
}

export default GovernanceProposalDetail
