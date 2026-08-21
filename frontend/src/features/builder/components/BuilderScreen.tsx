import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Folder, Users, Settings, ShoppingCart, DollarSign, Plus, CheckCircle, Save, Settings2, Edit, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/v1';
const TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';

type FieldType = { label: string; fieldType: string; isRequired: boolean; tabName: string; lookupEntityId?: string; colSpan?: number; };

export function BuilderScreen({ propMenuId, propGroupName }: { propMenuId?: string, propGroupName?: string }) {
  const [searchParams] = useSearchParams();
  const initialMenuId = propMenuId || searchParams.get('menuId');
  const initialGroupName = propGroupName || searchParams.get('groupName');

  const [activeMenu, setActiveMenu] = useState<any>(null);
  const [existingMenus, setExistingMenus] = useState<any[]>([]);
  const [existingEntities, setExistingEntities] = useState<any[]>([]);
  
  // Estados do Menu
  const [menuName, setMenuName] = useState('');
  const [menuIcon, setMenuIcon] = useState('folder');
  const [menuOrder, setMenuOrder] = useState<number>(1);
  const [menuIsActive, setMenuIsActive] = useState(true);
  
  // Estados do Formulário (Edição/Criação)
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [formDisplayName, setFormDisplayName] = useState(''); 
  const [menuGroupName, setMenuGroupName] = useState(initialGroupName || 'Cadastros Gerais'); 
  const [isCreating, setIsCreating] = useState(false);
  const [isNewMenu, setIsNewMenu] = useState(false); // NOVO ESTADO

  const [fields, setFields] = useState<FieldType[]>([
    { label: 'Nome', fieldType: 'TEXT', isRequired: true, tabName: 'Dados Principais', colSpan: 12 }
  ]);

  // Buscar menus e entidades existentes
  useEffect(() => {
    fetch(`${API_URL}/menus`, { headers: { 'x-tenant-id': TENANT_ID } })
      .then(res => res.json())
      .then(json => {
        const fetchedMenus = json.data || [];
        setExistingMenus(fetchedMenus);
        if (initialMenuId) {
          const selected = fetchedMenus.find((m: any) => m.id === initialMenuId);
          if (selected) {
            setActiveMenu(selected);
            setIsNewMenu(false);
          }
        }
      });
      
    fetch(`${API_URL}/metadata/entities`, { headers: { 'x-tenant-id': TENANT_ID } })
      .then(res => res.json())
      .then(json => setExistingEntities(json || []));
  }, [initialMenuId]);

  const handleSelectEntityToEdit = (entityId: string) => {
    setSelectedEntityId(entityId);
    if (!entityId) {
      setFormDisplayName('');
      setFields([{ label: 'Nome', fieldType: 'TEXT', isRequired: true, tabName: 'Dados Principais', colSpan: 12 }]);
      return;
    }

    const entity = existingEntities.find(e => e.id === entityId);
    if (entity) {
      setFormDisplayName(entity.displayName);
      
      // Reconstrói os fields baseando-se no layout
      const layoutTabs = entity.formLayouts?.[0]?.layoutConfig?.tabs || [];
      const newFields = entity.fields.map((f: any) => {
        // Acha a aba e o tamanho que esse campo pertence
        let tabName = 'Dados Principais';
        let colSpan = 12;
        
        for (const t of layoutTabs) {
          const fieldInTab = t.fields?.find((tf: any) => 
            typeof tf === 'string' ? tf === f.technicalName : tf.technicalName === f.technicalName
          );
          if (fieldInTab) {
            tabName = t.name;
            colSpan = typeof fieldInTab === 'string' ? 12 : (fieldInTab.colSpan || 12);
            break;
          }
        }

        return {
          label: f.label,
          fieldType: f.fieldType,
          isRequired: f.isRequired,
          lookupEntityId: f.lookupEntityId,
          tabName,
          colSpan
        };
      });
      setFields(newFields.length > 0 ? newFields : [{ label: 'Nome', fieldType: 'TEXT', isRequired: true, tabName: 'Dados Principais', colSpan: 12 }]);
    }
  };

  const addField = () => setFields([...fields, { label: '', fieldType: 'TEXT', isRequired: false, tabName: 'Dados Principais', colSpan: 12 }]);

  const updateField = (index: number, key: keyof FieldType, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch(`${API_URL}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
        body: JSON.stringify({ name: menuName, icon: menuIcon, order: menuOrder, isActive: menuIsActive, groups: [] })
      });
      const json = await res.json();
      if (res.ok) {
        setActiveMenu(json.data);
        setIsNewMenu(true); // Marca que acabou de criar um menu
      } else alert('Erro: ' + json.message);
    } finally { setIsCreating(false); }
  };

  const handleCreateFormForMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const baseTechnicalName = formDisplayName.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '_');
    
    const fieldsWithTechnicalNames = fields.map((f, i) => ({
      ...f,
      technicalName: f.label.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '_') + (i > 0 ? `_${i}` : '')
    }));

    const tabsMap = new Map<string, any[]>();
    fieldsWithTechnicalNames.forEach(f => {
      const tab = f.tabName || 'Principal';
      if (!tabsMap.has(tab)) tabsMap.set(tab, []);
      tabsMap.get(tab)?.push({
        technicalName: f.technicalName,
        colSpan: f.colSpan || 12
      });
    });

    const layoutConfig = {
      type: 'tabs',
      tabs: Array.from(tabsMap.entries()).map(([name, fieldObjects]) => ({ name, fields: fieldObjects }))
    };

    const formPayload = {
      technicalName: baseTechnicalName,
      displayName: formDisplayName,
      tableName: `tb_${baseTechnicalName}`,
      fields: fieldsWithTechnicalNames,
      formLayouts: [{ name: 'Layout Padrão', isDefault: true, layoutConfig }]
    };

    try {
      let resEntity;
      if (selectedEntityId) {
        resEntity = await fetch(`${API_URL}/metadata/entities/${selectedEntityId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
          body: JSON.stringify(formPayload)
        });
      } else {
        resEntity = await fetch(`${API_URL}/metadata/entities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
          body: JSON.stringify(formPayload)
        });
      }
      
      const entityJson = await resEntity.json();

      if (!resEntity.ok) return alert('Erro ao salvar formulário: ' + entityJson.message);

      if (!selectedEntityId) {
        const newEntityId = entityJson.data.id;
        const currentGroups = activeMenu.groups || [];
        
        let targetGroup = currentGroups.find((g: any) => g.name === menuGroupName);
        if (!targetGroup) {
          targetGroup = { name: menuGroupName, items: [] };
          currentGroups.push(targetGroup);
        }

        targetGroup.items.push({ label: formDisplayName, entityDefinitionId: newEntityId });

        const resMenu = await fetch(`${API_URL}/menus/${activeMenu.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
          body: JSON.stringify({ name: activeMenu.name, icon: activeMenu.icon, groups: currentGroups })
        });

        if (resMenu.ok) {
          const menuJson = await resMenu.json();
          setActiveMenu(menuJson.data); 
        }
      }

      setFormDisplayName('');
      setFields([{ label: 'Nome', fieldType: 'TEXT', isRequired: true, tabName: 'Dados Principais', colSpan: 12 }]);
      setSelectedEntityId('');
      
      alert(selectedEntityId ? 'Formulário atualizado com sucesso!' : 'Formulário adicionado com sucesso!');
      
    } finally { setIsCreating(false); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
          <Settings2 className="w-8 h-8 text-blue-600" />
          Construtor ERP Profissional
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Crie ou edite módulos e configure telas do sistema dinamicamente.
        </p>
      </div>
      
      {!activeMenu ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col gap-6">
          
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Selecione ou Crie um Módulo
            </h2>
          </div>

          {existingMenus.length > 0 && (
            <div className="px-6">
              <label className="text-sm font-bold text-slate-700 block mb-2">Trabalhar em um Módulo Existente:</label>
              <select 
                onChange={e => {
                  const selected = existingMenus.find(m => m.id === e.target.value);
                  if (selected) {
                    setActiveMenu(selected);
                    setIsNewMenu(false);
                  }
                }}
                defaultValue=""
                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-blue-50 text-blue-900 text-sm font-medium"
              >
                <option value="" disabled>-- Selecione um módulo já existente --</option>
                {existingMenus.map(menu => (
                  <option key={menu.id} value={menu.id}>{menu.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="px-6 flex items-center gap-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-bold text-slate-400 uppercase">OU CRIE UM NOVO</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          
          <form onSubmit={handleCreateMenu} className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Nome do Novo Módulo</label>
                <input 
                  value={menuName} 
                  onChange={e => setMenuName(e.target.value)} 
                  placeholder="Ex: Recursos Humanos" 
                  required 
                  className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Ícone</label>
                <div className="relative">
                  <select 
                    value={menuIcon} 
                    onChange={e => setMenuIcon(e.target.value)} 
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
                  >
                    <option value="folder">Pasta (Padrão)</option>
                    <option value="users">Usuários</option>
                    <option value="settings">Engrenagem</option>
                    <option value="shopping-cart">Vendas / Carrinho</option>
                    <option value="dollar-sign">Financeiro</option>
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    {menuIcon === 'folder' && <Folder className="w-4 h-4" />}
                    {menuIcon === 'users' && <Users className="w-4 h-4" />}
                    {menuIcon === 'settings' && <Settings className="w-4 h-4" />}
                    {menuIcon === 'shopping-cart' && <ShoppingCart className="w-4 h-4" />}
                    {menuIcon === 'dollar-sign' && <DollarSign className="w-4 h-4" />}
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isCreating} 
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-md font-bold shadow-sm transition-colors text-sm"
              >
                {isCreating ? 'Processando...' : 'Criar Módulo'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
              <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Construtor de Tela
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              Módulo Base: {activeMenu.name}
            </div>
          </div>
          
          <form onSubmit={handleCreateFormForMenu} className="p-6">
            
            {/* NOVO: OPÇÃO DE EDITAR UMA TELA EXISTENTE */}
            {existingEntities.length > 0 && !isNewMenu && (
              <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <label className="text-sm font-bold text-yellow-800 block mb-2 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Deseja editar uma tela que já existe neste módulo?
                </label>
                <select 
                  value={selectedEntityId}
                  onChange={e => handleSelectEntityToEdit(e.target.value)}
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm focus:ring-2 focus:ring-yellow-500 bg-white text-sm"
                >
                  <option value="">-- Não, quero criar uma tela NOVA --</option>
                  {existingEntities
                    .filter(entity => {
                      if (!activeMenu || !activeMenu.groups) return false;
                      return activeMenu.groups.some((group: any) => 
                        group.items?.some((item: any) => item.entityDefinitionId === entity.id)
                      );
                    })
                    .map(entity => (
                      <option key={entity.id} value={entity.id}>{entity.displayName}</option>
                    ))
                  }
                </select>
                {selectedEntityId && (
                  <p className="text-xs text-yellow-700 mt-2">
                    Aviso: Você está em modo de EDIÇÃO. Ao salvar, os dados da tela "{formDisplayName}" serão substituídos.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-inner">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Nome da Tela</label>
                <input 
                  value={formDisplayName} 
                  onChange={e => setFormDisplayName(e.target.value)} 
                  placeholder="Ex: Cadastro de Dependentes" 
                  required 
                  className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                />
              </div>
              {!selectedEntityId && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">Grupo no Menu Lateral (Pasta)</label>
                  <input 
                    list="existing-groups"
                    value={menuGroupName} 
                    onChange={e => setMenuGroupName(e.target.value)} 
                    placeholder="Ex: Cadastros Gerais" 
                    required={!selectedEntityId} 
                    className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                  />
                  <datalist id="existing-groups">
                    {activeMenu.groups?.map((g: any) => (
                      <option key={g.id} value={g.name} />
                    ))}
                  </datalist>
                  <span className="text-[10px] text-slate-500">Se digitar um grupo que já existe, ele adicionará lá dentro.</span>
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-slate-400" />
              Campos da Tela
            </h3>
            
            <div className="space-y-3 mb-6">
              {fields.map((field, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                  
                  <div className="flex-1 w-full flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aba Visual</label>
                    <input 
                      value={field.tabName} 
                      onChange={e => updateField(index, 'tabName', e.target.value)} 
                      placeholder="Ex: Dados Pessoais" 
                      required 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="flex-[2] w-full flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rótulo do Campo</label>
                    <input 
                      value={field.label} 
                      onChange={e => updateField(index, 'label', e.target.value)} 
                      placeholder="Ex: Nome Completo" 
                      required 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  
                  <div className="flex-1 w-full flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tipo</label>
                    <select 
                      value={field.fieldType} 
                      onChange={e => updateField(index, 'fieldType', e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="TEXT">Texto</option>
                      <option value="NUMBER">Número</option>
                      <option value="BOOLEAN">Checkbox</option>
                      <option value="DATE">Data</option>
                      <option value="REFERENCE">Relacionamento</option>
                    </select>
                  </div>

                  <div className="flex-1 w-full flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tamanho (Largura)</label>
                    <select 
                      value={field.colSpan || 12} 
                      onChange={e => updateField(index, 'colSpan', Number(e.target.value))} 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value={12}>100% da tela</option>
                      <option value={6}>50% (Metade)</option>
                      <option value={4}>33% (Um terço)</option>
                      <option value={3}>25% (Um quarto)</option>
                    </select>
                  </div>

                  {field.fieldType === 'REFERENCE' && (
                    <div className="flex-1 w-full flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Tabela / Tela Origem</label>
                      <select 
                        value={field.lookupEntityId || ''} 
                        onChange={e => updateField(index, 'lookupEntityId', e.target.value)} 
                        className="w-full px-3 py-2 border border-blue-300 bg-blue-50 text-blue-900 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="" disabled>-- Selecione --</option>
                        {existingEntities.map(entity => (
                          <option key={entity.id} value={entity.id}>{entity.displayName}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-end h-full md:mt-5">
                    <button 
                      type="button"
                      onClick={() => removeField(index)}
                      className="flex-shrink-0 bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-md border border-red-200 transition-colors"
                      title="Excluir este campo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={addField} 
              className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors border border-blue-200"
            >
              <Plus className="w-4 h-4" /> Adicionar Novo Campo
            </button>

            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isCreating} 
                className={`flex items-center gap-2 text-white px-8 py-3 rounded-md font-bold shadow-sm transition-colors text-sm ${
                  selectedEntityId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-[#10b981] hover:bg-[#059669]'
                }`}
              >
                <Save className="w-5 h-5" />
                {isCreating ? 'Processando...' : selectedEntityId ? 'Atualizar Tela Existente' : 'Salvar Tela e Gerar Layout'}
              </button>
            </div>
            
          </form>
        </div>
      )}
    </div>
  );
}
