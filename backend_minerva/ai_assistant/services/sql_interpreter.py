import sqlite3
import time
import logging
from typing import Dict, Any, List, Tuple, Optional
from django.db import connection
from django.conf import settings
from .gemini_service import GeminiService
from ..models import DatabaseSchema, QueryLog, ConversationSession

logger = logging.getLogger(__name__)


# Helper function for secure error responses
def get_error_details(exception):
    """
    Returns exception details only if DEBUG is enabled.
    In production, returns a generic message to avoid information leakage.
    """
    if settings.DEBUG:
        return str(exception)
    return "Contact support for more information"


class SQLInterpreterService:
    """
    Serviço para interpretar perguntas em linguagem natural e executar consultas SQL
    """
    
    def __init__(self):
        self.gemini_service = GeminiService()
        self.safe_tables = {
            'accounts_user', 'budget_budget', 'budget_budgetmovement', 
            'budgetline_budgetline', 'budgetline_budgetlineversion',
            'contract_contract', 'contract_contractinstallment', 
            'contract_contractamendment', 'employee_employee',
            'sector_direction', 'sector_coordination', 'sector_management',
            'center_management_center', 'center_requesting_center',
            'aid_assistance', 'aid_assistanceemployee'
        }
        
    def get_database_schema(self) -> str:
        """
        Obtém informações sobre o schema do banco de dados
        """
        try:
            # Busca informações do schema cache ou gera novo
            schema_info = self._get_cached_schema()
            if not schema_info:
                schema_info = self._generate_schema_info()
                self._cache_schema_info(schema_info)
            
            return schema_info
            
        except Exception as e:
            logger.error(f"Erro ao obter schema do banco: {str(e)}")
            return self._get_basic_schema_fallback()
    
    def _get_cached_schema(self) -> Optional[str]:
        """
        Busca informações de schema em cache
        """
        try:
            schemas = DatabaseSchema.objects.all()
            if not schemas.exists():
                return None
                
            schema_info = "ESQUEMA DO BANCO DE DADOS MINERVA:\n\n"
            current_table = ""
            
            for schema in schemas.order_by('table_name', 'column_name'):
                if schema.table_name != current_table:
                    current_table = schema.table_name
                    schema_info += f"\nTABELA: {schema.table_name}\n"
                    if schema.table_name in self._get_table_descriptions():
                        schema_info += f"Descrição: {self._get_table_descriptions()[schema.table_name]}\n"
                
                schema_info += f"  - {schema.column_name} ({schema.data_type})"
                if not schema.is_nullable:
                    schema_info += " NOT NULL"
                if schema.business_meaning:
                    schema_info += f" - {schema.business_meaning}"
                schema_info += "\n"
                
                if schema.sample_values:
                    schema_info += f"    Exemplos: {', '.join(map(str, schema.sample_values[:3]))}\n"
            
            return schema_info
            
        except Exception as e:
            logger.error(f"Erro ao buscar schema em cache: {str(e)}")
            return None
    
    def _generate_schema_info(self) -> str:
        """
        Gera informações detalhadas do schema do banco
        """
        with connection.cursor() as cursor:
            schema_info = "ESQUEMA DO BANCO DE DADOS MINERVA:\n\n"
            
            # Lista todas as tabelas
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name NOT LIKE 'sqlite_%' 
                AND name NOT LIKE 'django_%' 
                AND name NOT LIKE 'auth_%'
                ORDER BY name
            """)
            
            tables = cursor.fetchall()
            table_descriptions = self._get_table_descriptions()
            
            for table_row in tables:
                table_name = table_row[0]
                if table_name not in self.safe_tables:
                    continue
                    
                schema_info += f"\nTABELA: {table_name}\n"
                if table_name in table_descriptions:
                    schema_info += f"Descrição: {table_descriptions[table_name]}\n"
                
                # Obtém informações das colunas
                cursor.execute(f"PRAGMA table_info({table_name})")
                columns = cursor.fetchall()
                
                for col in columns:
                    col_name, col_type, not_null, default_value = col[1], col[2], col[3], col[4]
                    schema_info += f"  - {col_name} ({col_type})"
                    if not_null:
                        schema_info += " NOT NULL"
                    if default_value:
                        schema_info += f" DEFAULT {default_value}"
                    
                    # Adiciona exemplos de valores se disponível
                    try:
                        cursor.execute(f"SELECT DISTINCT {col_name} FROM {table_name} WHERE {col_name} IS NOT NULL LIMIT 3")
                        samples = cursor.fetchall()
                        if samples:
                            sample_values = [str(s[0]) for s in samples]
                            schema_info += f" - Exemplos: {', '.join(sample_values)}"
                    except:
                        pass
                    
                    schema_info += "\n"
            
            return schema_info
    
    def _get_table_descriptions(self) -> Dict[str, str]:
        """
        Retorna descrições das principais tabelas do sistema
        """
        return {
            'contract_contract': 'Contratos do sistema - contém informações sobre contratos, valores, datas, fiscais',
            'budget_budget': 'Orçamentos - contém informações sobre orçamentos anuais por centro gestor',
            'budget_budgetmovement': 'Movimentações orçamentárias - transferências entre orçamentos',
            'budgetline_budgetline': 'Linhas orçamentárias - detalhamento dos orçamentos',
            'employee_employee': 'Funcionários - informações dos colaboradores e fiscais',
            'accounts_user': 'Usuários do sistema',
            'contract_contractinstallment': 'Parcelas de contratos - pagamentos dos contratos',
            'contract_contractamendment': 'Aditivos contratuais - alterações nos contratos',
            'center_management_center': 'Centros gestores - unidades administrativas',
            'aid_assistance': 'Auxílios - benefícios concedidos aos funcionários'
        }
    
    def _get_basic_schema_fallback(self) -> str:
        """
        Schema básico em caso de falha
        """
        return """
        ESQUEMA BÁSICO DO SISTEMA MINERVA:
        
        TABELA: contract_contract
        - protocol_number (VARCHAR) - Número do protocolo do contrato
        - signing_date (DATE) - Data de assinatura
        - expiration_date (DATE) - Data de expiração
        - original_value (DECIMAL) - Valor original
        - current_value (DECIMAL) - Valor atual
        - start_date (DATE) - Data de início
        - end_date (DATE) - Data de término
        - status (VARCHAR) - Status: ATIVO, ENCERRADO
        
        TABELA: budget_budget
        - year (INTEGER) - Ano do orçamento
        - category (VARCHAR) - CAPEX ou OPEX
        - total_amount (DECIMAL) - Valor total
        - available_amount (DECIMAL) - Valor disponível
        - status (VARCHAR) - ATIVO, INATIVO
        
        TABELA: employee_employee
        - name (VARCHAR) - Nome do funcionário
        - cpf (VARCHAR) - CPF
        - admission_date (DATE) - Data de admissão
        - status (VARCHAR) - Status do funcionário
        """
    
    def _cache_schema_info(self, schema_info: str) -> None:
        """
        Salva informações do schema em cache para uso futuro
        """
        # Este método poderia implementar cache mais sofisticado
        # Por enquanto, apenas registra que foi chamado
        logger.info("Schema info cached")
    
    def interpret_and_execute(self, user_question: str, session: ConversationSession) -> Dict[str, Any]:
        """
        Interpreta pergunta e executa consulta SQL
        
        Args:
            user_question: Pergunta do usuário
            session: Sessão da conversa
            
        Returns:
            Dict com resultados e metadados
        """
        start_time = time.time()
        
        try:
            # Obtém schema do banco
            schema_info = self.get_database_schema()
            
            # Interpreta a pergunta usando Gemini
            interpretation_result = self.gemini_service.interpret_natural_language_query(
                user_question, schema_info
            )
            
            if not interpretation_result['success']:
                return {
                    'success': False,
                    'error': 'Não foi possível interpretar a pergunta',
                    'details': interpretation_result.get('error', 'Erro desconhecido')
                }
            
            interpretation = interpretation_result['interpretation']
            sql_query = interpretation.get('sql', '')
            
            # Valida a consulta SQL
            validation_result = self._validate_sql_query(sql_query)
            if not validation_result['valid']:
                return {
                    'success': False,
                    'error': 'Consulta SQL inválida',
                    'details': validation_result['error']
                }
            
            # Executa a consulta
            execution_result = self._execute_sql_query(sql_query)
            execution_time = int((time.time() - start_time) * 1000)
            
            # Log da consulta
            query_log = QueryLog.objects.create(
                session=session,
                user_question=user_question,
                interpreted_intent=interpretation.get('intent', ''),
                generated_sql=sql_query,
                execution_status='SUCCESS' if execution_result['success'] else 'ERROR',
                execution_time_ms=execution_time,
                result_count=len(execution_result.get('data', [])) if execution_result['success'] else None,
                error_message=execution_result.get('error', ''),
                gemini_response=interpretation_result
            )
            
            if execution_result['success']:
                # Gera resposta humanizada
                humanized_response = self.gemini_service.generate_humanized_response(
                    execution_result['data'], user_question, sql_query
                )
                
                return {
                    'success': True,
                    'data': execution_result['data'],
                    'sql_query': sql_query,
                    'interpretation': interpretation,
                    'humanized_response': humanized_response.get('content', ''),
                    'execution_time_ms': execution_time,
                    'result_count': len(execution_result['data']),
                    'query_log_id': query_log.id
                }
            else:
                return {
                    'success': False,
                    'error': 'Erro na execução da consulta',
                    'details': execution_result['error'],
                    'sql_query': sql_query,
                    'interpretation': interpretation,
                    'query_log_id': query_log.id
                }
                
        except Exception as e:
            logger.error(f"Erro na interpretação/execução: {str(e)}")
            return {
                'success': False,
                'error': 'Erro interno do servidor',
                'details': get_error_details(e)
            }
    
    def _validate_sql_query(self, sql_query: str) -> Dict[str, Any]:
        """
        Valida se a consulta SQL é segura para execução
        """
        if not sql_query or not sql_query.strip():
            return {'valid': False, 'error': 'Consulta SQL vazia'}
        
        sql_upper = sql_query.upper().strip()
        
        # Permite apenas SELECT
        if not sql_upper.startswith('SELECT'):
            return {'valid': False, 'error': 'Apenas consultas SELECT são permitidas'}
        
        # Verifica comandos perigosos
        dangerous_keywords = ['DELETE', 'DROP', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'TRUNCATE']
        for keyword in dangerous_keywords:
            if keyword in sql_upper:
                return {'valid': False, 'error': f'Comando {keyword} não é permitido'}
        
        # Verifica se usa apenas tabelas seguras
        used_tables = self._extract_table_names(sql_query)
        for table in used_tables:
            if table not in self.safe_tables:
                return {'valid': False, 'error': f'Acesso à tabela {table} não é permitido'}
        
        return {'valid': True}
    
    def _extract_table_names(self, sql_query: str) -> List[str]:
        """
        Extrai nomes de tabelas da consulta SQL (implementação básica)
        """
        # Implementação simplificada - poderia ser mais sofisticada
        import re
        
        # Remove comentários e strings
        sql_clean = re.sub(r'--.*?\n', '', sql_query)
        sql_clean = re.sub(r'/\*.*?\*/', '', sql_clean, flags=re.DOTALL)
        sql_clean = re.sub(r"'[^']*'", "''", sql_clean)
        sql_clean = re.sub(r'"[^"]*"', '""', sql_clean)
        
        # Busca por padrões FROM e JOIN
        table_pattern = r'\b(?:FROM|JOIN)\s+([a-zA-Z_][a-zA-Z0-9_]*)'
        matches = re.findall(table_pattern, sql_clean, re.IGNORECASE)
        
        return [match.lower() for match in matches]
    
    def _execute_sql_query(self, sql_query: str) -> Dict[str, Any]:
        """
        Executa consulta SQL de forma segura
        """
        try:
            with connection.cursor() as cursor:
                # Remove ponto e vírgula final se existir
                sql_query = sql_query.strip()
                if sql_query.endswith(';'):
                    sql_query = sql_query[:-1]
                
                # Adiciona LIMIT se não existir
                if 'LIMIT' not in sql_query.upper():
                    sql_query += ' LIMIT 100'
                
                cursor.execute(sql_query)
                
                # Obtém nomes das colunas
                columns = [desc[0] for desc in cursor.description] if cursor.description else []
                
                # Obtém dados
                rows = cursor.fetchall()
                
                # Converte para lista de dicionários
                data = []
                for row in rows:
                    row_dict = {}
                    for i, value in enumerate(row):
                        if i < len(columns):
                            row_dict[columns[i]] = value
                    data.append(row_dict)
                
                return {
                    'success': True,
                    'data': data,
                    'columns': columns,
                    'row_count': len(data)
                }
                
        except Exception as e:
            logger.error(f"Erro na execução SQL: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }