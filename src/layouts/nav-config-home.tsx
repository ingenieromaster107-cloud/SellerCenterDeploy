import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------
const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  users: icon('ic-users'),
  order: icon('ic-shopping-cart'),
  product: icon('ic-product'),
  home: icon('ic-dashboard'),
  dashboard: icon('ic-analytics'),
  return: icon('ic-refresh'),
  feedback: icon('ic-feedback'),
  academy: <Iconify icon="solar:notebook-bold-duotone" width={24} />,
  chat: <Iconify icon="solar:chat-round-dots-bold" width={24} />,
  movements: <Iconify icon="solar:bill-list-bold-duotone" width={24} />,
  promotions: <Iconify icon="solar:tag-horizontal-bold-duotone" width={24} />,
};

// ----------------------------------------------------------------------

export const useNavData = (): NavSectionProps['data'] => {
  const { translate } = useTranslate();

  return useMemo(
    () => [
      {
        items: [
          {
            title: translate('sidebarMenu.home.title'),
            path: paths.home.root,
            icon: ICONS.home,
            onboarding: {
              active: true,
              target: 'sidebar-metrics-sections',
            },
          },
          {
            title: translate('sidebarMenu.dashboard.title'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
            onboarding: {
              active: true,
              target: 'dashboard-sections',
            },
          },
        ],
      },
      {
        items: [
          {
            title: translate('sidebarMenu.myProducts.title'),
            path: paths.product.root,
            icon: ICONS.product,
            children: [
              {
                title: translate('sidebarMenu.myProducts.subtitles.list'),
                path: paths.product.root,
                onboarding: {
                  active: true,
                  target: 'sidebar-dashboard-sections-products',
                },
              },
              {
                title: translate('sidebarMenu.myProducts.subtitles.loadProducts'),
                path: paths.product.load,
                onboarding: {
                  active: true,
                  target: 'sidebar-dashboard-sections-load-products',
                },
              },
            ],
            onboarding: {
              active: true,
              target: 'sidebar-dashboard-sections',
            },
          },
          {
            title: translate('sidebarMenu.returns.title'),
            path: paths.return.root,
            icon: ICONS.return,
            children: [
              { title: translate('sidebarMenu.returns.subtitles.list'), path: paths.return.root },
            ],
            onboarding: {
              active: true,
              target: 'sidebar-dashboard-sections-returns',
            }
          },
          {
            title: translate('ordersModule.title'),
            path: paths.order.root,
            icon: ICONS.order,
            children: [{ title: translate('ordersModule.list.title'), path: paths.order.root }],
            onboarding: {
              active: true,
              target: 'sidebar-dashboard-sections-orders',
            }
          },
          {
            title: translate('sidebarMenu.clients.title'),
            path: paths.clients.root,
            icon: ICONS.users,
            onboarding: {
              active: true,
              target: 'sidebar-dashboard-sections-clients',
            }
          },
          {
            title: translate('sidebarMenu.feedback.title'),
            path: paths.feedback.root,
            icon: ICONS.feedback,
            onboarding: {
              active: true,
              target: 'sidebar-dashboard-sections-feedback',
            }
          },
          {
            title: translate('sidebarMenu.movements.title'),
            path: paths.movements.root,
            icon: ICONS.movements,
          },
          // Academy: visible para cualquier estado de vinculación del seller
          // (Pendiente, Procesando, Aprobado, Desaprobado). HU325974.
          {
            title: translate('sidebarMenu.academy.title'),
            path: paths.academy.root,
            icon: ICONS.academy,
            onboarding: {
              active: true,
              target: 'sidebar-dashboard-sections-academy',
            }
          },
          {
            title: translate('sidebarMenu.chat.title'),
            path: paths.chat.root,
            icon: ICONS.chat,
            onboarding: {
              active: true,
              target: 'sidebar-dashboard-sections-chat',
            }
          },
          {
            title: translate('sidebarMenu.promotions.title'),
            path: paths.promotions.root,
            icon: ICONS.promotions,
            children: [
              { title: translate('sidebarMenu.promotions.subtitles.list'), path: paths.promotions.root },
              { title: translate('sidebarMenu.promotions.subtitles.create'), path: paths.promotions.create },
            ],
          },
        ],
      },
      {
        subheader: translate('sidebarMenu.subAccount.subheader'),
        items: [
          {
            title: translate('sidebarMenu.subAccount.title'),
            path: paths.account.subaccount.root,
            icon: ICONS.users,
          },
        ],
        onboarding: {
          active: true,
          target: 'sidebar-dashboard-sections-subaccounts',
        }
      },
    ],
    [translate]
  );
};
