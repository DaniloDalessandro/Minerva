# Sistema Hierárquico de Setores - Backend Django

## Visão Geral

O sistema implementa uma hierarquia organizacional completa com três níveis:
- **Direções** (nível superior)
- **Gerências** (vinculadas a Direções)
- **Coordenações** (vinculadas a Gerências)

## Estrutura dos Modelos

### Direction (Direção)
```python
- id: BigAutoField (PK)
- name: CharField(100) - único, com validação customizada
- created_at: DateTimeField (auto_now_add)
- updated_at: DateTimeField (auto_now)
- created_by: ForeignKey(User)
- updated_by: ForeignKey(User)
```

### Management (Gerência)
```python
- id: BigAutoField (PK)
- direction: ForeignKey(Direction) - CASCADE
- name: CharField(100) - com validação customizada
- created_at: DateTimeField (auto_now_add)
- updated_at: DateTimeField (auto_now)
- created_by: ForeignKey(User)
- updated_by: ForeignKey(User)
- unique_together: ('direction', 'name')
```

### Coordination (Coordenação)
```python
- id: BigAutoField (PK)
- management: ForeignKey(Management) - CASCADE
- name: CharField(100) - com validação customizada
- created_at: DateTimeField (auto_now_add)
- updated_at: DateTimeField (auto_now)
- created_by: ForeignKey(User)
- updated_by: ForeignKey(User)
- unique_together: ('management', 'name')
```

## APIs Disponíveis

### Direções
- `GET /sector/directions/` - Listar direções (com contagem de gerências)
- `POST /sector/directions/create/` - Criar direção
- `GET /sector/directions/{id}/` - Detalhar direção
- `PUT /sector/directions/{id}/update/` - Atualizar direção
- `DELETE /sector/directions/{id}/delete/` - Deletar direção

### Gerências
- `GET /sector/managements/` - Listar gerências (com informações da direção e contagem de coordenações)
- `POST /sector/managements/create/` - Criar gerência
- `GET /sector/managements/{id}/` - Detalhar gerência
- `PUT /sector/managements/{id}/update/` - Atualizar gerência
- `DELETE /sector/managements/{id}/delete/` - Deletar gerência

### Coordenações
- `GET /sector/coordinations/` - Listar coordenações (com informações hierárquicas completas)
- `POST /sector/coordinations/create/` - Criar coordenação
- `GET /sector/coordinations/{id}/` - Detalhar coordenação
- `PUT /sector/coordinations/{id}/update/` - Atualizar coordenação
- `DELETE /sector/coordinations/{id}/delete/` - Deletar coordenação

## Recursos Implementados

### Filtros e Busca
- **Direções**: Busca por nome, ordenação por nome/data
- **Gerências**: Busca por nome/direção, filtro por direção, ordenação por nome/data/direção
- **Coordenações**: Busca por nome/gerência/direção, filtro por gerência/direção, ordenação por nome/data/gerência

### Validações
- **Unicidade**: Nome único para direções, nome único por direção para gerências, nome único por gerência para coordenações
- **Formato**: Validação de caracteres permitidos (letras, números, espaços, hífens, etc.)
- **Tamanho**: Mínimo 3 caracteres, máximo 100 caracteres
- **Integridade**: Validações em serializers para evitar duplicações

### Otimizações de Performance
- **Select Related**: Usado para reduzir queries em relacionamentos FK
- **Prefetch Related**: Usado para otimizar contagens de relacionamentos reversos
- **Serializers Específicos**: Serializers otimizados para listagem vs CRUD

### Auditoria
- Controle de criação e atualização com usuário e timestamp
- Histórico completo de mudanças através dos campos created_by, updated_by, created_at, updated_at

## Segurança
- Todas as APIs protegidas por `IsAuthenticated`
- Validações robustas contra injeção e dados maliciosos
- Relacionamentos em CASCADE para integridade referencial

## Estrutura de Resposta das APIs

### Listagem de Direções
```json
{
  "results": [
    {
      "id": 1,
      "name": "Direção de TI",
      "created_at": "2025-08-22 16:00:00",
      "updated_at": "2025-08-22 16:00:00",
      "managements_count": 3
    }
  ]
}
```

### Listagem de Gerências
```json
{
  "results": [
    {
      "id": 1,
      "name": "Gerência de Desenvolvimento",
      "direction": 1,
      "direction_name": "Direção de TI",
      "created_at": "2025-08-22 16:00:00",
      "updated_at": "2025-08-22 16:00:00",
      "coordinations_count": 2
    }
  ]
}
```

### Listagem de Coordenações
```json
{
  "results": [
    {
      "id": 1,
      "name": "Coordenação Frontend",
      "management": 1,
      "management_name": "Gerência de Desenvolvimento",
      "direction_name": "Direção de TI",
      "created_at": "2025-08-22 16:00:00",
      "updated_at": "2025-08-22 16:00:00"
    }
  ]
}
```

## Arquivos Principais

### Modelos
- `C:\Users\danilo.ecopel\Documents\PROJETOS\PYTHON\Sys_Minerva\Minerva\backend_minerva\sector\models.py`

### Serializers
- `C:\Users\danilo.ecopel\Documents\PROJETOS\PYTHON\Sys_Minerva\Minerva\backend_minerva\sector\serializers.py`

### Views
- `C:\Users\danilo.ecopel\Documents\PROJETOS\PYTHON\Sys_Minerva\Minerva\backend_minerva\sector\views.py`

### URLs
- `C:\Users\danilo.ecopel\Documents\PROJETOS\PYTHON\Sys_Minerva\Minerva\backend_minerva\sector\urls.py`

### Validadores
- `C:\Users\danilo.ecopel\Documents\PROJETOS\PYTHON\Sys_Minerva\Minerva\backend_minerva\sector\utils\validators.py`

### Mensagens
- `C:\Users\danilo.ecopel\Documents\PROJETOS\PYTHON\Sys_Minerva\Minerva\backend_minerva\sector\utils\messages.py`

### Admin
- `C:\Users\danilo.ecopel\Documents\PROJETOS\PYTHON\Sys_Minerva\Minerva\backend_minerva\sector\admin.py`

## Status da Implementação

✅ **Estrutura completa implementada**
✅ **APIs CRUD funcionais**
✅ **Validações robustas**
✅ **Otimizações de performance**
✅ **Filtros e busca avançada**
✅ **Interface administrativa**
✅ **Migrações aplicadas**
✅ **Documentação completa**

O sistema está **100% funcional** e pronto para integração com o frontend.