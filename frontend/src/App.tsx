import { useState } from 'react';

const API_URL = 'http://localhost:3000/api/v1';
const TENANT_ID = '550e8400-e29b-41d4-a716-446655440000';

function App() {
  // Estado do Menu Ativo
  const [activeMenu, setActiveMenu] = useState<any>(null);
  
  // Estados para inputs
  const [menuName, setMenuName] = useState('');
  const [formName, setFormName] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // 1. Cria o Menu Principal (A Gaveta)
  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const payload = {
      name: menuName,
      icon: 'folder',
      groups: [] // Nasce vazio
    };

    try {
      const res = await fetch(`${API_URL}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.ok) {
        setActiveMenu(json.data);
        alert('Menu criado! Agora você pode adicionar formulários a ele.');
      } else {
        alert('Erro: ' + json.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // 2. Cria o Formulário e automaticamente vincula ao Menu
  const handleCreateFormForMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // Passo 2.1: Cria o Metadado (Tabela Dinâmica)
    const formPayload = {
      technicalName: formName,
      displayName: formDisplayName,
      tableName: `table_${formName}`,
      fields: [
        { technicalName: 'nome', label: 'Nome', fieldType: 'TEXT', isRequired: true } // Campo padrão
      ]
    };

    try {
      const resEntity = await fetch(`${API_URL}/metadata/entities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
        body: JSON.stringify(formPayload)
      });
      const entityJson = await resEntity.json();

      if (!resEntity.ok) return alert('Erro ao criar formulário.');

      const newEntityId = entityJson.data.id;

      // Passo 2.2: Pega os dados atuais do menu para manter o histórico
      const currentGroups = activeMenu.groups || [];
      
      // Se não tem grupo nenhum, cria um grupo padrão
      if (currentGroups.length === 0) {
        currentGroups.push({ name: 'Cadastros Gerais', items: [] });
      }

      // Adiciona o novo botão apontando para o formulário criado
      currentGroups[0].items.push({
        label: formDisplayName,
        entityDefinitionId: newEntityId
      });

      // Passo 2.3: Atualiza o Menu no Back-end com o vínculo (PUT)
      const menuPayload = {
        name: activeMenu.name,
        icon: activeMenu.icon,
        groups: currentGroups
      };

      const resMenu = await fetch(`${API_URL}/menus/${activeMenu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': TENANT_ID },
        body: JSON.stringify(menuPayload)
      });

      const menuJson = await resMenu.json();
      if (resMenu.ok) {
        setActiveMenu(menuJson.data); // Atualiza a tela com a árvore final!
        setFormName('');
        setFormDisplayName('');
      }

    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '900px', margin: 'auto' }}>
      <h1>⚙️ Construtor de ERP Dinâmico</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Simulação do fluxo: <i>Menus primeiro, formulários depois.</i></p>

      {!activeMenu ? (
        <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <h2>1. Crie um novo Módulo (Menu)</h2>
          <form onSubmit={handleCreateMenu} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <input 
              value={menuName} onChange={e => setMenuName(e.target.value)}
              placeholder="Ex: Recursos Humanos" required
              style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button type="submit" disabled={isCreating} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Criar Menu
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          
          {/* Painel Esquerdo: Simulador do Menu Lateral */}
          <div style={{ flex: 1, background: '#2c3e50', color: '#fff', padding: '20px', borderRadius: '10px' }}>
            <h3>📱 Preview do Menu Lateral</h3>
            <hr style={{ borderColor: '#34495e' }}/>
            <h4 style={{ color: '#18bc9c' }}>📂 {activeMenu.name}</h4>
            
            <div style={{ marginLeft: '15px' }}>
              {activeMenu.groups?.map((group: any) => (
                <div key={group.name} style={{ marginTop: '15px' }}>
                  <strong style={{ color: '#95a5a6', fontSize: '14px', textTransform: 'uppercase' }}>
                    {group.name}
                  </strong>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                    {group.items?.map((item: any) => (
                      <li key={item.label} style={{ padding: '8px 10px', background: '#34495e', marginBottom: '5px', borderRadius: '5px', fontSize: '15px' }}>
                        📄 {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {(!activeMenu.groups || activeMenu.groups.length === 0) && (
                <p style={{ color: '#7f8c8d', fontSize: '14px', fontStyle: 'italic' }}>Nenhum formulário vinculado ainda.</p>
              )}
            </div>
          </div>

          {/* Painel Direito: Construtor de Formulários */}
          <div style={{ flex: 2, background: '#fff', padding: '30px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
            <h2>2. Adicionar Formulário ao Menu</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>Isto irá gerar o metadado no banco e conectar o formulário a este menu.</p>
            
            <form onSubmit={handleCreateFormForMenu} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Nome Visível (Botão no Menu):</label>
                <input 
                  value={formDisplayName} onChange={e => setFormDisplayName(e.target.value)}
                  placeholder="Ex: Cadastro de Funcionários" required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Nome Técnico (Banco de Dados):</label>
                <input 
                  value={formName} onChange={e => setFormName(e.target.value)}
                  placeholder="Ex: hr_employee_v2" required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <button type="submit" disabled={isCreating} style={{ padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isCreating ? 'Gerando e Vinculando...' : '+ Gerar Formulário'}
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;