import {
  User,
  ChevronDown,
  Folder,
  Users,
  Settings,
  ShoppingCart,
  DollarSign,
  Grip,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DynamicScreen } from '../../features/dynamic/components/DynamicScreen';
import { BuilderScreen } from '../../features/builder/components/BuilderScreen';

const API_URL = 'http://localhost:3000/api/v1';
const TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';

const ICON_MAP: Record<string, any> = {
  folder: Folder,
  users: Users,
  settings: Settings,
  'shopping-cart': ShoppingCart,
  'dollar-sign': DollarSign,
};

type Tab = {
  id: string;
  title: string;
  type: 'dynamic' | 'builder';
  entityId?: string;
  menuId?: string;
  groupName?: string;
};

export function MainLayout() {
  const [menus, setMenus] = useState<any[]>([]);

  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/menus`, { headers: { 'x-tenant-id': TENANT_ID } })
      .then((res) => res.json())
      .then((json) => setMenus(json.data || []));
  }, []);

  const openTab = (tab: Tab) => {
    const existing = tabs.find((t) => t.id === tab.id);
    if (!existing) {
      setTabs([...tabs, tab]);
    }
    setActiveTabId(tab.id);
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen font-sans bg-slate-50 text-slate-800">
      {/* HEADER (Barra Azul Escura Estilo Protheus) */}
      <header className="h-14 bg-[#0f172a] text-white flex items-center justify-between px-4 shrink-0 shadow-md relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-wide">
            <Grip className="w-5 h-5 text-blue-400" />
            <span>ERP Builder</span>
          </div>

          {/* Menus Clássicos */}
          <nav className="hidden md:flex gap-4 text-[13px] text-slate-300 font-medium">
            <a href="#" className="hover:text-white transition-colors">
              Arquivo
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Atualizações
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Consultas
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Relatórios
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Miscelânea
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Ambiente
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-6 text-[13px] text-slate-300">
          <span className="hidden lg:block">Empresa 01 / Filial 0101</span>
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
            <User className="w-4 h-4" />
            <span>Administrador</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-red-400 transition-colors">
            <span>Sair</span>
          </div>
        </div>
      </header>

      {/* ÁREA INFERIOR (SIDEBAR + CONTEÚDO) */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm relative z-0">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-slate-500 font-medium text-xs tracking-widest">
            <Grip className="w-4 h-4" />
            MÓDULOS
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {menus.map((menu) => {
              const IconComponent = ICON_MAP[menu.icon] || Folder;
              return (
                <div key={menu.id} className="mb-2">
                  <div className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-blue-600 uppercase tracking-wide cursor-default">
                    <IconComponent className="w-4 h-4" />
                    <span className="truncate">{menu.name}</span>
                  </div>

                  {menu.groups?.map((group: any) => (
                    <div key={group.id} className="mt-1">
                      <div
                        className="flex items-center justify-between px-4 py-1.5 bg-slate-50 border-y border-slate-100 hover:bg-slate-100 cursor-pointer group"
                        onClick={() => {
                          openTab({
                            id: `builder-${menu.id}-${group.name}`,
                            title: group.name,
                            type: 'builder',
                            menuId: menu.id,
                            groupName: group.name,
                          });
                        }}
                      >
                        <div className="flex items-center gap-2 text-[12px] font-bold text-slate-700">
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{group.name}</span>
                        </div>
                        <button
                          className="w-5 h-5 flex items-center justify-center rounded-sm bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                          title="Criar nova rotina neste grupo"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <ul className="mt-1">
                        {group.items?.map((item: any) => {
                          const tabId = `dynamic-${item.entityDefinitionId}`;
                          const isActive = activeTabId === tabId;

                          return (
                            <li key={item.id}>
                              <button
                                onClick={() =>
                                  openTab({
                                    id: tabId,
                                    title: item.label,
                                    type: 'dynamic',
                                    entityId: item.entityDefinitionId,
                                  })
                                }
                                className={`w-full text-left flex items-center justify-between px-11 py-2 text-[13px] transition-colors
                                  ${
                                    isActive
                                      ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-500'
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                  }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="w-3.5 h-3.5 flex items-center justify-center border border-current rounded-sm text-[8px] opacity-70">
                                    📄
                                  </span>
                                  <span className="truncate">{item.label}</span>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* BOX DO CONSTRUTOR */}
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() =>
                openTab({
                  id: 'builder',
                  title: 'Construtor',
                  type: 'builder',
                })
              }
              className="w-full text-left block bg-blue-50 border border-blue-100 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-1">
                <Settings className="w-4 h-4" />
                Construtor
              </div>
              <p className="text-[11px] text-blue-600 leading-tight">
                Telas, grids e formulários são gerados a partir dos metadados de cada tabela.
              </p>
            </button>
          </div>
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden relative">
          {/* MDI TABS */}
          {tabs.length > 0 && (
            <div className="h-10 bg-white border-b border-slate-200 flex items-end px-2 pt-2 gap-1 shrink-0 overflow-x-auto select-none">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-4 py-1.5 rounded-t-md text-sm font-medium flex items-center gap-2 cursor-pointer shadow-sm transition-colors border border-b-0 ${
                    activeTabId === tab.id
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-white border-transparent text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate max-w-[150px]">{tab.title}</span>
                  <button
                    onClick={(e) => closeTab(e, tab.id)}
                    className={`ml-2 rounded-sm transition-colors ${
                      activeTabId === tab.id
                        ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'
                        : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-auto relative">
            {/* Renderiza todas as abas abertas, escondendo as inativas (Preserva Estado) */}
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`absolute inset-0 ${activeTabId === tab.id ? 'block' : 'hidden'}`}
              >
                {tab.type === 'dynamic' && tab.entityId && (
                  <DynamicScreen propEntityId={tab.entityId} />
                )}
                {tab.type === 'builder' && (
                  <BuilderScreen propMenuId={tab.menuId} propGroupName={tab.groupName} />
                )}
              </div>
            ))}

            {/* Tela de Boas Vindas se não tiver aba aberta */}
            {tabs.length === 0 && (
              <div className="h-full flex items-center justify-center bg-white">
                <div className="text-center">
                  <Grip className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-700">Bem-vindo ao ERP Builder</h2>
                  <p className="text-slate-500 mt-2">
                    Selecione uma rotina no menu lateral para iniciar.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RODAPÉ DO PROTHEUS */}
          <footer className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-4 text-[11px] text-slate-500 shrink-0">
            <div className="flex gap-4">
              <span>Rotina: Sistema ERP Dinâmico</span>
              <span>Ambiente: Desenvolvimento</span>
            </div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
              <span>produced by</span>
              <span className="text-red-400">♥</span>
              <span>LS Dev</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
