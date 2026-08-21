import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Database, Plus, Edit2, Trash2, Printer, Search, Filter, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/v1';
const TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';

function ReferenceSelect({ field, defaultValue, onChange }: { field: any, defaultValue?: any, onChange?: (val: string, record?: any) => void }) {
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    if (field.lookupEntityId) {
      fetch(`${API_URL}/records/${field.lookupEntityId}`, { headers: { 'x-tenant-id': TENANT_ID } })
        .then(res => res.json())
        .then(json => setOptions(json.data || []));
    }
  }, [field.lookupEntityId]);

  return (
    <div className="relative">
      <select 
        name={field.technicalName}
        required={field.isRequired}
        defaultValue={defaultValue || ''}
        onChange={e => {
          const val = e.target.value;
          const selectedRecord = options.find(o => o.id === val);
          onChange && onChange(val, selectedRecord);
        }}
        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-slate-50"
      >
        <option value="">Selecione...</option>
        {options.map((opt: any) => (
          <option key={opt.id} value={opt.id}>
            {/* Tenta achar um campo 'nome' ou 'descricao' para mostrar no select */}
            {opt.data?.nome || opt.data?.descricao || opt.data?.label || opt.data?.titulo || opt.id.split('-')[0]}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
    </div>
  );
}

function SubGridInput({ field, gridData, setGridData }: { field: any, gridData: Record<string, any[]>, setGridData: any }) {
  const items = gridData[field.technicalName] || [];
  const cols = field.options?.subFields || []; // e.g. [{ name: 'total', isCalculated: true, formulaExpression: '...' }]

  const evaluateFormulas = (row: any) => {
    const newRow = { ...row };
    cols.filter((c: any) => c.isCalculated && c.formulaExpression).forEach((c: any) => {
      try {
        const fn = new Function('row', `return ${c.formulaExpression}`);
        newRow[c.name] = fn(newRow);
      } catch (e) {
        console.error('Erro na formula:', c.formulaExpression, e);
      }
    });
    return newRow;
  };

  const handleAddRow = () => {
    let newRow: any = {};
    cols.forEach((c: any) => newRow[c.name] = '');
    newRow = evaluateFormulas(newRow);
    setGridData((prev: any) => ({ ...prev, [field.technicalName]: [...(prev[field.technicalName] || []), newRow] }));
  };

  const handleRowUpdate = (index: number, updates: Record<string, any>) => {
    setGridData((prev: any) => {
      const currentItems = prev[field.technicalName] || [];
      const newItems = [...currentItems];
      newItems[index] = evaluateFormulas({ ...newItems[index], ...updates });
      return { ...prev, [field.technicalName]: newItems };
    });
  };

  const handleRemove = (index: number) => {
    setGridData((prev: any) => {
      const currentItems = prev[field.technicalName] || [];
      return { ...prev, [field.technicalName]: currentItems.filter((_: any, i: number) => i !== index) };
    });
  };

  if (!cols.length) return <div className="text-red-500 text-sm">Configuração de colunas do grid ausente.</div>;

  return (
    <div className="border border-slate-200 rounded-md overflow-hidden col-span-12">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <span className="font-semibold text-sm text-slate-700">{field.label}</span>
        <button type="button" onClick={handleAddRow} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
          + Adicionar Item
        </button>
      </div>
      <div className="p-4 bg-white overflow-x-auto">
        {items.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-4">Nenhum item adicionado.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {cols.map((c: any) => <th key={c.name} className="pb-2 font-medium text-slate-600">{c.label}</th>)}
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row: any, i: number) => (
                <tr key={i} className="border-b border-slate-50">
                  {cols.map((c: any) => (
                    <td key={c.name} className="py-2 pr-2">
                      {c.type === 'REFERENCE' ? (
                        <ReferenceSelect 
                          field={{ ...c, technicalName: c.name }} 
                          defaultValue={row[c.name]} 
                          onChange={(val, record) => {
                            const updates: any = { [c.name]: val };
                            if (record && c.fillFields) {
                               Object.keys(c.fillFields).forEach(targetCol => {
                                  updates[targetCol] = record.data[c.fillFields[targetCol]];
                               });
                            }
                            handleRowUpdate(i, updates);
                          }}
                        />
                      ) : (
                        <input 
                          type={c.type === 'NUMBER' ? 'number' : 'text'}
                          value={row[c.name] || ''}
                          readOnly={c.isCalculated}
                          onChange={e => !c.isCalculated && handleRowUpdate(i, { [c.name]: e.target.value })}
                          className={`w-full px-2 py-1 border border-slate-300 rounded focus:border-blue-500 outline-none ${c.isCalculated ? 'bg-slate-100 text-slate-500 cursor-not-allowed font-medium' : ''}`}
                        />
                      )}
                    </td>
                  ))}
                  <td className="py-2">
                    <button type="button" onClick={() => handleRemove(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export function DynamicScreen({ propEntityId }: { propEntityId?: string }) {
  const params = useParams();
  const entityId = propEntityId || params.entityId;
  const [entityDef, setEntityDef] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'BROWSE' | 'FORM'>('BROWSE');
  const [activeTab, setActiveTab] = useState<string>('');
  const [records, setRecords] = useState<any[]>([]);
  const [referenceDictionaries, setReferenceDictionaries] = useState<Record<string, Record<string, string>>>({});
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [gridData, setGridData] = useState<Record<string, any[]>>({});

  const fetchRecords = () => {
    fetch(`${API_URL}/records/${entityId}`, { headers: { 'x-tenant-id': TENANT_ID } })
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setRecords(json.data.map((r: any) => ({ ...r.data, _recordId: r.id })));
          setSelectedRecordId(null); // Reset selection on reload
        }
      });
  };

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
        fetchRecords();

        // NOVO: Buscar dicionários para campos REFERENCE (Para mostrar o NOME na Grid em vez do ID)
        if (found && found.fields) {
          const refFields = found.fields.filter((f: any) => f.fieldType === 'REFERENCE' && f.lookupEntityId);
          refFields.forEach((field: any) => {
            fetch(`${API_URL}/records/${field.lookupEntityId}`, { headers: { 'x-tenant-id': TENANT_ID } })
              .then(res => res.json())
              .then(json => {
                if (json.data) {
                  const dict: Record<string, string> = {};
                  json.data.forEach((r: any) => {
                    dict[r.id] = r.data?.nome || r.data?.descricao || r.data?.label || r.data?.titulo || r.id.split('-')[0];
                  });
                  setReferenceDictionaries(prev => ({ ...prev, [field.technicalName]: dict }));
                }
              });
          });
        }
      })
      .finally(() => setLoading(false));
  }, [entityId]);

  const handleAddClick = () => {
    setEditingRecord(null);
    setGridData({});
    setViewMode('FORM');
  };

  const handleEditClick = () => {
    if (!selectedRecordId) return alert('Selecione um registro na tabela primeiro.');
    const record = records.find(r => r._recordId === selectedRecordId);
    
    // Extrai os campos que são array para o estado do sub-grid
    const gData: Record<string, any[]> = {};
    if (record) {
      Object.keys(record).forEach(k => {
        if (Array.isArray(record[k])) gData[k] = record[k];
      });
    }
    
    setGridData(gData);
    setEditingRecord(record);
    setViewMode('FORM');
  };

  const handleDeleteClick = async () => {
    if (!selectedRecordId) return alert('Selecione um registro na tabela primeiro.');
    if (confirm('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.')) {
      try {
        const res = await fetch(`${API_URL}/records/${entityId}/${selectedRecordId}`, { 
          method: 'DELETE', 
          headers: { 'x-tenant-id': TENANT_ID } 
        });
        if (res.ok) {
          alert('Registro excluído com sucesso!');
          fetchRecords();
        } else {
          alert('Erro ao excluir registro.');
        }
      } catch (err) {
        alert('Erro de conexão ao excluir.');
      }
    }
  };

  const handleSaveRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataObj = Object.fromEntries(formData.entries());
    
    // Mescla o objeto de form padrão com as sub-grids
    const finalData = { ...dataObj, ...gridData };
    
    const url = editingRecord 
      ? `${API_URL}/records/${entityId}/${editingRecord._recordId}` 
      : `${API_URL}/records/${entityId}`;
    const method = editingRecord ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
        body: JSON.stringify(finalData)
      });
      const json = await res.json();
      if (res.ok) {
        alert('Salvo com sucesso!');
        setViewMode('BROWSE');
        fetchRecords();
      } else {
        alert('Erro ao salvar: ' + json.message);
      }
    } catch (err) {
      alert('Erro de conexão ao salvar.');
    }
  };

  if (loading) return <div className="p-6 text-slate-500">Carregando estrutura da tela...</div>;
  if (!entityDef) return <div className="p-6 text-red-500">Erro: Formulário não encontrado no banco.</div>;

  const layoutConfig = entityDef.formLayouts?.[0]?.layoutConfig;
  const hasTabs = layoutConfig?.type === 'tabs' && layoutConfig.tabs?.length > 0;
  const gridColumns = entityDef?.fields?.filter((f: any) => !f.isCalculated && f.fieldType !== 'GRID') || [];

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
    }[colSpan as 12|6|4|3] || 'col-span-12';

    const defaultValue = editingRecord ? editingRecord[technicalName] : '';

    return (
      <div className={`${colSpanClass} flex flex-col gap-1.5`}>
        <label className="text-sm font-semibold text-slate-700">
          {field.label}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.fieldType === 'BOOLEAN' ? (
          <input type="checkbox" name={field.technicalName} defaultChecked={!!defaultValue} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
        ) : field.fieldType === 'DATE' ? (
          <input 
            type="date" 
            name={field.technicalName}
            required={field.isRequired}
            defaultValue={defaultValue}
            className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        ) : field.fieldType === 'REFERENCE' ? (
          <ReferenceSelect 
            field={field} 
            defaultValue={defaultValue} 
            onChange={(_, record) => {
              if (record && field.options?.fillFields) {
                 Object.keys(field.options.fillFields).forEach(targetCol => {
                    const input = document.querySelector(`[name="${targetCol}"]`) as HTMLInputElement;
                    if (input) {
                       input.value = record.data[field.options.fillFields[targetCol]] || '';
                    }
                 });
              }
            }}
          />
        ) : field.fieldType === 'GRID' ? (
          <SubGridInput field={field} gridData={gridData} setGridData={setGridData} />
        ) : (
          <input 
            type="text" 
            name={field.technicalName}
            required={field.isRequired}
            defaultValue={defaultValue}
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
            <button onClick={handleAddClick} className="flex items-center gap-1.5 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Incluir
            </button>
            <button onClick={handleEditClick} className="flex items-center gap-1.5 bg-[#fcd34d] hover:bg-[#fbbf24] text-slate-800 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <Edit2 className="w-4 h-4" /> Alterar
            </button>
            <button onClick={handleDeleteClick} className="flex items-center gap-1.5 bg-[#f87171] hover:bg-[#ef4444] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
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
                      <tr 
                        key={i} 
                        onClick={() => setSelectedRecordId(row._recordId)}
                        className={`transition-colors cursor-pointer ${selectedRecordId === row._recordId ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="radio" 
                            name="grid_select" 
                            checked={selectedRecordId === row._recordId}
                            readOnly
                            className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                          />
                        </td>
                        {gridColumns.map((col: any) => {
                          let displayValue = row[col.technicalName];
                          if (col.fieldType === 'REFERENCE' && referenceDictionaries[col.technicalName]) {
                             displayValue = referenceDictionaries[col.technicalName][displayValue] || displayValue;
                          }
                          return (
                            <td key={col.technicalName} className="p-4 text-slate-700 whitespace-nowrap">
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO COM ABAS SHADCN-STYLE */
          <form key={editingRecord?._recordId || 'new'} className="flex flex-col h-full" onSubmit={handleSaveRecord}>
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
                <div className="grid grid-cols-12 gap-6">
                  {layoutConfig.tabs.find((t: any) => t.name === activeTab)?.fields.map((fieldObj: any, idx: number) => (
                    <React.Fragment key={idx}>{renderField(fieldObj)}</React.Fragment>
                  ))}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-12 gap-6">
                {entityDef.fields?.map((f: any, idx: number) => (
                  <React.Fragment key={idx}>{renderField(f.technicalName)}</React.Fragment>
                ))}
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end gap-3">
               <button 
                 type="button" 
                 onClick={() => setViewMode('BROWSE')}
                 className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-md text-sm font-bold shadow-sm transition-colors"
               >
                 Cancelar
               </button>
               <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm transition-colors">
                 Salvar e Concluir
               </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
