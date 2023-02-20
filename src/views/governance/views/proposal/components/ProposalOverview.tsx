import styled from '@emotion/styled'
import { Trans } from '@lingui/macro'
import { useAtomValue, useSetAtom } from 'jotai'
import { Box, BoxProps, Button, Flex, Text } from 'theme-ui'
import { isProposalEditingAtom, isProposalValidAtom } from '../atoms'
import CreateProposalActionIcon from 'components/icons/CreateProposalActionIcon'
import ProposalPreview from './ProposalPreview'

const Container = styled(Box)`
  height: fit-content;
`

const ProposalOverview = (props: BoxProps) => {
  const isValid = useAtomValue(isProposalValidAtom)
  const setProposalEditing = useSetAtom(isProposalEditingAtom)

  // Change to confirmation screen
  const handleProposal = () => {
    setProposalEditing(false)
  }

  return (
    <Container sx={{ position: 'sticky', top: 0 }} p={0} {...props}>
      <Box
        sx={{
          maxHeight: 'calc(100vh - 124px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Flex
          sx={{
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
          }}
          variant="layout.borderBox"
        >
          <CreateProposalActionIcon />
          <Text variant="title" mb={2}>
            <Trans>Create Proposal</Trans>
          </Text>
          <Text variant="legend" as="p">
            Review of function calls & adding a description of your proposal
            will be done in the next step.
          </Text>
          <Button
            onClick={handleProposal}
            variant="primary"
            disabled={!isValid}
            mt={4}
            sx={{ width: '100%' }}
          >
            <Trans>Confirm changes</Trans>
          </Button>
        </Flex>
        <ProposalPreview sx={{ flexGrow: 1, overflow: 'auto' }} />
      </Box>
    </Container>
  )
}

export default ProposalOverview
