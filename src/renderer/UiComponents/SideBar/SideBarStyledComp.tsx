import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from "@mui/material/List";

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(5)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(6)} + 1px)`,
    },
  });

export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    background: `rgba(3, 4, 4, 0.2);`,
    borderRadius: "16px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1);",
    border: "1px solid rgba(3, 4, 4, 0.3)",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop:any) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      background: `rgba(3, 4, 4, 0.2);`,
      borderRadius: "16px",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1);",
      border: "1px solid rgba(3, 4, 4, 0.3)",
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
);


export const StyledSideBarList = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 16,
    paddingRight: 16,
  },
  '& .MuiListItemButton-root:hover': {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#29AB87",
    borderRadius: "0px 30px 30px 0px;"
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

export const StyledInnerSideBarList = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemButton-root:hover': {
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: "#29AB87",
    borderRadius: "0px 30px 30px 0px;"
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});