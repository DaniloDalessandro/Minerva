import google.generativeai as genai
import json
import logging
from typing import Dict, Any, Optional
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

logger = logging.getLogger(__name__)


class GeminiService:
    """
    Serviço para integração com a API do Google Gemini
    """
    
    def __init__(self):
        self.api_key = getattr(settings, 'GEMINI_API_KEY', None)
        if not self.api_key:
            raise ImproperlyConfigured("GEMINI_API_KEY não configurada nas settings")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def generate_response(self, prompt: str, system_instruction: str = None) -> Dict[str, Any]:
        """
        Gera uma resposta usando o modelo Gemini
        
        Args:
            prompt: O prompt para enviar ao modelo
            system_instruction: Instrução do sistema (opcional)
            
        Returns:
            Dict com a resposta e metadados
        """
        try:
            if system_instruction:
                full_prompt = f"System: {system_instruction}\n\nUser: {prompt}"
            else:
                full_prompt = prompt
                
            response = self.model.generate_content(full_prompt)
            
            return {
                'success': True,
                'content': response.text,
                'usage': {
                    'prompt_tokens': len(full_prompt.split()),
                    'completion_tokens': len(response.text.split()) if response.text else 0,
                },
                'model': 'gemini-1.5-flash',
                'metadata': {
                    'finish_reason': 'stop',
                    'safety_ratings': getattr(response, 'safety_ratings', [])
                }
            }
            
        except Exception as e:
            logger.error(f"Erro ao gerar resposta com Gemini: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'content': None
            }
    
    def interpret_natural_language_query(self, user_question: str, schema_info: str) -> Dict[str, Any]:
        """
        Interpreta uma pergunta em linguagem natural e gera SQL
        
        Args:
            user_question: Pergunta do usuário
            schema_info: Informações sobre o esquema do banco
            
        Returns:
            Dict com SQL gerado e metadados
        """
        system_instruction = """
        Você é Alice, um assistente especializado em interpretar perguntas sobre dados financeiros e gerar consultas SQL.
        
        CONTEXTO DO SISTEMA MINERVA:
        - Sistema de gestão de contratos, orçamentos e funcionários
        - Banco de dados SQLite
        - Tabelas principais: contracts, budgets, employees, budget_lines, etc.
        
        REGRAS IMPORTANTES:
        1. SEMPRE gere SQL válido para SQLite
        2. Use APENAS tabelas e colunas que existem no schema fornecido
        3. Para valores monetários, use formatação brasileira (R$)
        4. Para datas, considere formato brasileiro (DD/MM/YYYY)
        5. Seja conservador com JOINs - use apenas quando necessário
        6. Sempre inclua limitadores (LIMIT) quando apropriado
        7. Para agregações, sempre use GROUP BY quando necessário
        
        FORMATO DE RESPOSTA:
        Responda SEMPRE em JSON válido com esta estrutura:
        {
            "intent": "descrição da intenção interpretada",
            "sql": "consulta SQL gerada",
            "explanation": "explicação em português do que a consulta faz",
            "confidence": número de 0 a 1 indicando confiança,
            "tables_used": ["lista", "de", "tabelas", "utilizadas"],
            "potential_issues": ["possíveis problemas ou limitações"]
        }
        """
        
        prompt = f"""
        ESQUEMA DO BANCO DE DADOS:
        {schema_info}
        
        PERGUNTA DO USUÁRIO:
        {user_question}
        
        Interprete a pergunta e gere uma consulta SQL apropriada.
        """
        
        response = self.generate_response(prompt, system_instruction)
        
        if response['success']:
            try:
                # Tenta parsear a resposta como JSON
                content = response['content']
                # Remove markdown se presente
                if content.startswith('```json'):
                    content = content.replace('```json', '').replace('```', '').strip()
                elif content.startswith('```'):
                    content = content.replace('```', '').strip()
                
                parsed_response = json.loads(content)
                
                return {
                    'success': True,
                    'interpretation': parsed_response,
                    'raw_response': response['content'],
                    'metadata': response.get('metadata', {})
                }
                
            except json.JSONDecodeError as e:
                logger.error(f"Erro ao parsear resposta JSON do Gemini: {str(e)}")
                return {
                    'success': False,
                    'error': f"Resposta inválida do modelo: {str(e)}",
                    'raw_response': response['content']
                }
        else:
            return response
    
    def generate_humanized_response(self, query_result: Any, original_question: str, sql_query: str) -> Dict[str, Any]:
        """
        Gera uma resposta humanizada baseada nos resultados da consulta
        
        Args:
            query_result: Resultado da consulta SQL
            original_question: Pergunta original do usuário
            sql_query: Consulta SQL executada
            
        Returns:
            Dict com resposta humanizada
        """
        system_instruction = """
        Você é Alice, assistente do Sistema Minerva. Sua função é transformar resultados de consultas SQL
        em respostas naturais e amigáveis para os usuários.
        
        DIRETRIZES:
        1. Use linguagem natural e amigável
        2. Formate valores monetários como R$ X.XXX,XX
        3. Use datas no formato brasileiro
        4. Se não houver resultados, seja empática e sugira alternativas
        5. Destaque informações importantes
        6. Seja concisa mas informativa
        7. Se houver muitos resultados, resuma os principais insights
        """
        
        # Converte o resultado para string legível
        if hasattr(query_result, '__iter__') and not isinstance(query_result, str):
            try:
                result_str = json.dumps(list(query_result), default=str, ensure_ascii=False, indent=2)
            except:
                result_str = str(query_result)
        else:
            result_str = str(query_result)
        
        prompt = f"""
        PERGUNTA ORIGINAL: {original_question}
        
        CONSULTA SQL EXECUTADA: {sql_query}
        
        RESULTADOS DA CONSULTA:
        {result_str}
        
        Transforme estes resultados em uma resposta natural e amigável para o usuário.
        Se não há resultados, explique de forma empática e sugira possíveis alternativas.
        """
        
        return self.generate_response(prompt, system_instruction)