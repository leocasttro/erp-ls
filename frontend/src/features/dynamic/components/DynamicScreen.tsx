import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Database, Plus, Edit2, Trash2, Printer, Search, Filter, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/v1';
const TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';

export function DynamicScreen({ propEntityId }: { propEntityId?: string }) {
  const params = useParams();
  const entityId = propEntityId || params.entityId;
  const [entityDef, setEntityDef] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'BROWSE' | 'FORM'>('BROWSE');
  const [activeTab, setActiveTab] = useState<string>('');
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    setViewMode('BROWSE');
    fetch(`${API_URL}/metadata/entities`, { headers: { 'x-tenant-id': TENANT_ID } })
      .then(res => res.json())
      .then(data => {
        const found = data.find((e: any) => e.id === entityId);
        setEntityDef(found);
        if (found?.formLayouts?.[0]?.layoutConfig?.tabs?.length > 0) {
          setActiveTab(found.formLayouts[0].layoutConfig.tabs[0].name);
        }
      })
      .finally(() => setLoading(false));
  }, [entityId]);

  if (loading) return <div className="p-6 text-slate-500">Carregando estrutura da tela...</div>;
  if (!entityDef) return <div className="p-6 text-red-500">Erro: Formulário não encontrado no banco.</div>;

  const layoutConfig = entityDef.formLayouts?.[0]?.layoutConfig;
  const hasTabs = layoutConfig?.type === 'tabs' && layoutConfig.tabs?.length > 0;
  const gridColumns = entityDef.fields?.slice(0, 7) || [];

  const renderField = (fieldObj: any) => {
    const technicalName = typeof fieldObj === 'string' ? fieldObj : fieldObj.technicalName;
    const colSpan = typeof fieldObj === 'string' ? 12 : (fieldObj.colSpan || 12);
    
    const field = entityDef.fields?.find((f: any) => f.technicalName === technicalName);
    if (!field) return null;

    const colSpanClass = {
      12: 'col-span-12',
      6: 'col-span-12 md:col-span-6',
      4: 'col-span-12 md:col-span-4',
      3: 'col-span-12 md:col-span-3',
    }[colSpan as number] || 'col-span-12';

    return (
      <div key={field.technicalName} className={`flex flex-col gap-1.5 ${colSpanClass}`}>
        <label className="text-[13px] font-bold text-slate-700">
          {field.label} {field.isRequired && <span className="text-red-500">*</span>}
        </label>
        {field.fieldType === 'BOOLEAN' ? (
          <input type="checkbox" name={field.technicalName} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
        ) : field.fieldType === 'DATE' ? (
          <input 
            type="date" 
            name={field.technicalName}
            required={field.isRequired}
            className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        ) : field.fieldType === 'REFERENCE' ? (
          <div className="relative">
            <select 
              name={field.technicalName}
              required={field.isRequired}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-slate-50"
            >
              <option value="">Buscar registro relacionado...</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
          </div>
        ) : (
          <input 
            type="text" 
            name={field.technicalName}
            required={field.isRequired}
            className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[70vh]">
      
      {/* CABEÇALHO */}
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {entityDef.displayName}
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            Registro e gestão completa de metadados.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-3 bg-slate-50 px-2 py-1 rounded w-fit border border-slate-100">
            <Database className="w-3 h-3" />
            Tabela vinculada: {entityDef.tableName}
          </div>
        </div>
        
        {viewMode === 'BROWSE' ? (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setViewMode('FORM')} className="flex items-center gap-1.5 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Incluir
            </button>
            <button className="flex items-center gap-1.5 bg-[#fcd34d] hover:bg-[#fbbf24] text-slate-800 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Edit2 className="w-4 h-4" /> Alterar
            </button>
            <button className="flex items-center gap-1.5 bg-[#f87171] hover:bg-[#ef4444] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Printer className="w-4 h-4" /> Imprimir
            </button>
          </div>
        ) : (
          <button onClick={() => setViewMode('BROWSE')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
            ⬅ Voltar
          </button>
        )}
      </div>

      <div className="p-6 flex-1 bg-white">
        {viewMode === 'BROWSE' ? (
          <div className="flex flex-col gap-4">
            
            {/* BARRA DE PESQUISA E FILTROS */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-1 gap-2 w-full">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Pesquisar em todos os campos..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  <Filter className="w-4 h-4" /> Filtros
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  <RefreshCw className="w-4 h-4" /> Atualizar
                </button>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {records.length} de {records.length} registros
              </div>
            </div>

            {/* DATA GRID TIPO PROTHEUS/SHADCN */}
            <div className="border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold tracking-wider">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <input type="checkbox" className="rounded border-slate-300" disabled />
                    </th>
                    {gridColumns.map((col: any) => (
                      <th key={col.technicalName} className="p-4 uppercase whitespace-nowrap">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={gridColumns.length + 1} className="p-12 text-center text-slate-400">
                        Nenhum registro de <strong className="text-slate-500">{entityDef.displayName}</strong> encontrado no banco de dados.
                      </td>
                    </tr>
                  ) : (
                    records.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-center">
                          <input type="radio" name="grid_select" className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500" />
                        </td>
                        {gridColumns.map((col: any) => (
                          <td key={col.technicalName} className="p-4 text-slate-700 whitespace-nowrap">{row[col.technicalName]}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO COM ABAS SHADCN-STYLE */
          <div className="flex flex-col h-full">
            {hasTabs ? (
              <>
                <div className="flex gap-2 border-b border-slate-200 mb-6">
                  {layoutConfig.tabs.map((tab: any) => (
                    <button
                      key={tab.name}
                      type="button"
                      onClick={() => setActiveTab(tab.name)}
                      className={`px-5 py-2.5 text-sm font-semibold transition-all mb-[-1px] ${
                        activeTab === tab.name 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300 border-b-2 border-transparent'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
                <form className="grid grid-cols-12 gap-6">
                  {layoutConfig.tabs.find((t: any) => t.name === activeTab)?.fields.map((fieldObj: any, idx: number) => (
                    <React.Fragment key={idx}>{renderField(fieldObj)}</React.Fragment>
                  ))}
                </form>
              </>
            ) : (
              <form className="grid grid-cols-12 gap-6">
                {entityDef.fields?.map((f: any, idx: number) => (
                  <React.Fragment key={idx}>{renderField(f.technicalName)}</React.Fragment>
                ))}
              </form>
            )}

            <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end gap-3">
               <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-md text-sm font-bold shadow-sm transition-colors">
                 Cancelar
               </button>
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm transition-colors">
                 Salvar e Concluir
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
