'use client';

import 'src/locales/langs/dayjs-locales';

import { useNavigate } from 'react-router';
import { useState, useEffect  } from 'react';
import { EVENTS, ACTIONS, Joyride, type Placement } from 'react-joyride';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { themeConfig, ThemeProvider } from 'src/theme';
import { useTranslate, TranslateProvider } from 'src/locales';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context';

import { useTourContext } from './contexts/tour';
import { TourProvider } from './contexts/tour/tour-provider';

// ----------------------------------------------------------------------

function DayjsLocalizationProvider({ children }: { children: React.ReactNode }) {
  const { currentLang } = useTranslate();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={currentLang}>
      {children}
    </LocalizationProvider>
  );
}

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

function AppTour({ children }: Props) {
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const { setRunTour, runTour, currentStepIndex, setCurrentStepIndex } = useTourContext();
  useEffect(() => {
    localStorage.setItem('tour-step-index', String(currentStepIndex));
  }, [currentStepIndex]);

  const handleJoyrideEvent: Parameters<typeof Joyride>[0]['onEvent'] = (data) => {
    const { action, type, index } = data;

    if (type === EVENTS.STEP_BEFORE) {
      const step = steps[index] as (typeof steps)[number] & { requiredPath?: string };
      if (
        step.requiredPath &&
        !`${window.location.pathname}${window.location.search}`.includes(step.requiredPath)
      ) {
        const [pathname, search] = step.requiredPath.split('?');
        navigate({ pathname, search: search ? `?${search}` : '' });
        return;
      }
      const target = document.querySelector(step.target as string);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    if (type === EVENTS.TOUR_END || action === ACTIONS.CLOSE) {
      setRunTour(false);
    }

    if (action !== ACTIONS.STOP) {
      setCurrentStepIndex(index);
    }
  };

  const steps = [
    // ── PERFIL DE USUARIO (/account) ──────────────────────────────────────
    {
      content: translate('onboardingSteps.welcome'),
      target: '.store-resume',
      requiredPath: '/account',
    },
    {
      content: translate('onboardingSteps.profile.overview'),
      target: '.profile-section',
      placement: 'left' as Placement,
    },
    {
      content: translate('onboardingSteps.profile.tabs'),
      target: '.profile-section-options',
      hideFooter: true,
      placement: 'left' as Placement,
    },
    {
      content: translate('onboardingSteps.profile.tabProfile'),
      target: '.profile-tab-profile',
      requiredPath: '/account',
      placement: 'bottom' as Placement,
    },
    {
      content: translate('onboardingSteps.profile.tabConfiguration'),
      target: '.profile-tab-configuration',
      requiredPath: '/account?tab=configuration',
      placement: 'bottom' as Placement,
    },
    {
      content: translate('onboardingSteps.profile.tabSecurity'),
      target: '.profile-tab-security',
      requiredPath: '/account?tab=security',
      placement: 'bottom' as Placement,
    },
    {
      content: translate('onboardingSteps.profile.tabDocuments'),
      target: '.profile-tab-documents',
      requiredPath: '/account?tab=documents',
      placement: 'bottom' as Placement,
    },
    {
      content: translate('onboardingSteps.profile.tabResponseTemplate'),
      target: '.profile-tab-response-template',
      requiredPath: '/account?tab=responseTemplate',
      placement: 'bottom' as Placement,
    },

    // ── HOME / OVERVIEW (/home) ────────────────────────────────────────────
    {
      content: translate('onboardingSteps.home.overview'),
      target: '.sidebar-metrics-sections',
      hideFooter: true,
      requiredPath: '/home',
    },
    { content: translate('onboardingSteps.home.metrics'), target: '.metrics-sections' },
    { content: translate('onboardingSteps.home.reputation'), target: '.reputation-panel' },
    { content: translate('onboardingSteps.home.lastOrders'), target: '.last-orders' },
    { content: translate('onboardingSteps.home.topProducts'), target: '.top-products' },
    { content: translate('onboardingSteps.home.topCustomers'), target: '.top-customers' },

    // ── DASHBOARD (/dashboard) ────────────────────────────────────────────
    {
      content: translate('onboardingSteps.dashboard.overview'),
      target: '.dashboard-sections',
      requiredPath: '/dashboard',
    },
    {
      content: translate('onboardingSteps.dashboard.summary'),
      target: '.dashboard-summary-card',
      placement: 'left' as Placement,
    },

    // ── PRODUCTOS (/product) ──────────────────────────────────────────────
    {
      content: translate('onboardingSteps.products.sidebar'),
      target: '.sidebar-dashboard-sections',
      requiredPath: '/product',
    },
    {
      content: translate('onboardingSteps.products.list'),
      target: '.sidebar-dashboard-sections-products',
      requiredPath: '/product',
    },
    {
      content: translate('onboardingSteps.products.list'),
      target: '.product-list-view',
      placement: 'button' as Placement,
    },
    {
      content: translate('onboardingSteps.products.load'),
      target: '.sidebar-dashboard-sections-load-products',
      requiredPath: '/product/load',
    },

    // ── DEVOLUCIONES (/return) ────────────────────────────────────────────
    {
      content: translate('onboardingSteps.returns.sidebar'),
      target: '.sidebar-dashboard-sections-returns',
      requiredPath: '/return',
    },
    {
      content: translate('onboardingSteps.returns.list'),
      target: '.return-list-view',
      placement: 'button' as Placement,
    },

    // ── ÓRDENES (/order) ──────────────────────────────────────────────────
    {
      content: translate('onboardingSteps.orders.sidebar'),
      target: '.sidebar-dashboard-sections-orders',
      requiredPath: '/order',
    },
    {
      content: translate('onboardingSteps.orders.list'),
      target: '.order-list-view',
      placement: 'button' as Placement,
    },

    // ── CLIENTES (/clients) ───────────────────────────────────────────────
    {
      content: translate('onboardingSteps.clients.sidebar'),
      target: '.sidebar-dashboard-sections-clients',
      requiredPath: '/clients',
    },
    {
      content: translate('onboardingSteps.clients.list'),
      target: '.clients-view',
      placement: 'button' as Placement,
    },

    // ── FEEDBACK (/feedback) ──────────────────────────────────────────────
    {
      content: translate('onboardingSteps.feedback.sidebar'),
      target: '.sidebar-dashboard-sections-feedback',
      requiredPath: '/feedback',
    },
    {
      content: translate('onboardingSteps.feedback.list'),
      target: '.feedback-view',
      placement: 'button' as Placement,
    },

    // ── ACADEMIA (/academy) ───────────────────────────────────────────────
    {
      content: translate('onboardingSteps.academy.sidebar'),
      target: '.sidebar-dashboard-sections-academy',
      requiredPath: '/academy',
    },
    {
      content: translate('onboardingSteps.academy.list'),
      target: '.academy-list-view',
      placement: 'button' as Placement,
    },

    // ── CHAT (/chat) ──────────────────────────────────────────────────────
    {
      content: translate('onboardingSteps.chat.sidebar'),
      target: '.sidebar-dashboard-sections-chat',
      requiredPath: '/chat',
    },
    {
      content: translate('onboardingSteps.chat.view'),
      target: '.chat-view',
      placement: 'button' as Placement,
    },

    // ── SUBCUENTAS (/account/subaccount) ──────────────────────────────────
    {
      content: translate('onboardingSteps.subaccounts.sidebar'),
      target: '.sidebar-dashboard-sections-subaccounts',
      requiredPath: '/account/subaccount',
    },
    {
      content: translate('onboardingSteps.subaccounts.list'),
      target: '.subaccount-list-view',
      placement: 'button' as Placement,
    },
  ];

  return (
    <>
      {runTour && (
        <style>{`
          .layout__header,
          .layout__header * {
            z-index: 0 !important;
            pointer-events: none !important;
          }
        `}</style>
      )}
      <Joyride
        continuous
        scrollToFirstStep
        debug
        steps={steps}
        run={runTour}
        onEvent={handleJoyrideEvent}
        locale={{
          back: translate('onboardingSteps.buttons.back'),
          next: translate('onboardingSteps.buttons.next'),
          last: translate('onboardingSteps.buttons.last'),
          close: translate('onboardingSteps.buttons.close'),
          skip: translate('onboardingSteps.buttons.skip'),
        }}
        styles={{
          tooltipContent: {
            fontFamily:
              '"Prospero",-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
        }}
        options={{
          zIndex: 100000,
          scrollOffset: 80,
          scrollDuration: 400,
          width: 400,
          buttons: ['back', 'close', 'primary', 'skip'],
          overlayClickAction: false,
          dismissKeyAction: false,
          skipScroll: true,
        }}
      />
      {children}
    </>
  );
}

export default function App({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TranslateProvider>
        <DayjsLocalizationProvider>
          <SettingsProvider defaultSettings={defaultSettings}>
            <ThemeProvider
              modeStorageKey={themeConfig.modeStorageKey}
              defaultMode={themeConfig.defaultMode}
            >
              <AuthProvider>
                <MotionLazy>
                  <ProgressBar />
                  <SettingsDrawer defaultSettings={defaultSettings} />
                  <Snackbar />
                  <TourProvider>
                  <AppTour>
                    {children}
                  </AppTour>
                  </TourProvider>
                </MotionLazy>
              </AuthProvider>
            </ThemeProvider>
          </SettingsProvider>
        </DayjsLocalizationProvider>
      </TranslateProvider>
    </QueryClientProvider>
  );
}
