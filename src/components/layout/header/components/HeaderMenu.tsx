import { t } from '@lingui/macro'
import BasketCubeIcon from 'components/icons/BasketCubeIcon'
import BridgeNavIcon from 'components/icons/BridgeNavIcon'
import EarnNavIcon from 'components/icons/EarnNavIcon'
import WalletOutlineIcon from 'components/icons/WalletOutlineIcon'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { selectedRTokenAtom } from 'state/atoms'
import { borderRadius } from 'theme'
import { Box, Text } from 'theme-ui'
import { ROUTES } from 'utils/constants'
import TokenToggle from './TokenToggle'

const HeaderMenu = () => {
  const selectedRToken = useAtomValue(selectedRTokenAtom)
  const menuItems = useMemo(
    () => [
      {
        label: t`Compare`,
        icon: <BasketCubeIcon fontSize={20} />,
        to: ROUTES.HOME,
      },
      {
        label: t`Portfolio`,
        icon: <WalletOutlineIcon fontSize={20} />,
        to: ROUTES.PORTFOLIO,
      },
      {
        label: t`Earn`,
        icon: <EarnNavIcon fontSize={20} />,
        to: ROUTES.EARN,
      },
      { label: t`Bridge`, icon: <BridgeNavIcon />, to: ROUTES.BRIDGE },
    ],
    []
  )

  return (
    <Box
      variant="layout.verticalAlign"
      p={1}
      sx={{
        border: '1px solid',
        borderColor: 'border',
        fontSize: 1,
        borderRadius: borderRadius.boxes,
      }}
    >
      {menuItems.map((menuItem, index) => (
        <NavLink
          key={menuItem.to}
          to={`${menuItem.to}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {({ isActive }: { isActive: boolean }) => (
            <Box
              variant="layout.verticalAlign"
              sx={{
                backgroundColor: isActive ? 'background' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'primary' : 'transparent',
                borderRadius: borderRadius.inner,
                justifyContent: 'center',
                width: [40, 'auto'],
                height: '40px',
                ':hover': {
                  backgroundColor: isActive ? 'background' : 'border',
                },
              }}
              p={2}
              ml={index ? 1 : 0}
            >
              {menuItem.icon}
              <Text ml="2" sx={{ display: ['none', 'none', 'block'] }}>
                {menuItem.label}
              </Text>
            </Box>
          )}
        </NavLink>
      ))}
      <Box
        p={2}
        ml={2}
        sx={{
          backgroundColor: !!selectedRToken ? 'background' : 'transparent',
          border: '1px solid',
          borderColor: !!selectedRToken ? 'primary' : 'transparent',
          borderRadius: borderRadius.inner,
          ':hover': {
            backgroundColor: !!selectedRToken ? 'background' : 'border',
          },
        }}
      >
        <TokenToggle />
      </Box>
    </Box>
  )
}

export default HeaderMenu
