import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../../shared/components/MainLayout';
import { DynamicScreen } from '../../features/dynamic/components/DynamicScreen';
import { BuilderScreen } from '../../features/builder/components/BuilderScreen';

function WelcomeScreen() {
  return (
    <div>
      <h1 style={{ color: '#2c3e50' }}>Bem-vindo ao ERP</h1>
      <p style={{ color: '#7f8c8d' }}>Selecione uma rotina no menu lateral para iniciar.</p>
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<WelcomeScreen />} />
          <Route path="dynamic/:entityId" element={<DynamicScreen />} />
          <Route path="builder" element={<BuilderScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
