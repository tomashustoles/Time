import { useState } from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { SettingsProvider } from './providers/SettingsProvider';
import { AnimatedBackground } from './components/AnimatedBackground';
import { GridLayout } from './components/layout/GridLayout';
import { Corner } from './components/layout/Corner';
import { Clock } from './components/Clock';
import { AppIdentity } from './components/AppIdentity';
import { Temperature } from './components/Temperature';
import { Headlines } from './components/Headlines';
import { Markets } from './components/Markets';
import { SettingsPanel } from './components/SettingsPanel';
import { Sheet } from './components/ui/Sheet';

function AppContent() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {/* Animated gradient background */}
      <AnimatedBackground />

      {/* Main layout */}
      <GridLayout>
        {/* Top Left - App Identity (click to open settings) */}
        <Corner position="top-left">
          <AppIdentity onSettingsClick={() => setSettingsOpen(true)} />
        </Corner>

        {/* Top Right - Temperature */}
        <Corner position="top-right">
          <Temperature />
        </Corner>

        {/* Center - Clock */}
        <Corner position="center">
          <Clock />
        </Corner>

        {/* Bottom Left - Headlines */}
        <Corner position="bottom-left">
          <Headlines />
        </Corner>

        {/* Bottom Right - Markets (BTC & S&P 500) */}
        <Corner position="bottom-right">
          <Markets />
        </Corner>
      </GridLayout>

      {/* Settings Sheet */}
      <Sheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
      >
        <SettingsPanel />
      </Sheet>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;

