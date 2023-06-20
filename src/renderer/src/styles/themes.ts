import { ThemeConfig } from 'antd/es/config-provider/context'
import { lighten, rgba } from 'polished'

export const sizes = {}

const _colors = {
  primary: '#06CA91',
  sidebarBG: '#2E3136',
  contentBG: '#36393F',
  selectedBG: '',
  buttonBG: '',
  scrollTrackBG: '#2e3338',
  scrollThumbBG: '#202225',
  borderColor: '#43474D',
  textColor1: '#ffffff',
  textColor2: '#8E9297',
  formFieldBG: '#313339',

  success: '#4caf50',
  error: '#FE6968',

  red: '#ff453a',
  orange: '#ff9f0a',
  yellow: '#ffd60a',
  green: '#30d158',
  mint: '#66d4cf',
  teal: '#40c8e0',
  cyan: '#64d2ff',
  blue: '#0a84ff',
  indigo: '#5e5ce6',
  purple: '#bf5af2',
  pink: '#ff375f',
  brown: '#ac8e68',

  gold: '#e0b667',
}

_colors.selectedBG = rgba(_colors.primary, 0.1)
_colors.buttonBG = lighten(0.06, _colors.contentBG)

export const colors = _colors

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorPrimaryBg: rgba(colors.primary, 0.1),
    colorBgBase: colors.contentBG,
    colorBgContainer: colors.formFieldBG,
    colorText: colors.textColor1,
    colorTextQuaternary: colors.textColor2,
    colorBorder: colors.borderColor,
    colorIcon: colors.textColor1,
  },
  components: {
    Table: {
      colorBgContainer: colors.sidebarBG,
    },
    Popover: {
      colorBgElevated: colors.sidebarBG,
    },
    Notification: {
      colorBgElevated: colors.sidebarBG,
    },
  },
}
