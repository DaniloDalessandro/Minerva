/**
 * Constantes centralizadas de status do sistema
 * Usado para padronizar filtros em todos os DataTables
 */

/**
 * Valores de status usados por entidades com campo "status" (ex: Colaborador)
 */
export const STATUS_VALUES = {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  ALL: 'ALL',
} as const;

/**
 * Valores de status usados por entidades com campo "is_active" (ex: Direction, Management, etc.)
 */
export const IS_ACTIVE_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALL: 'ALL',
} as const;

/**
 * Opções de filtro para entidades com campo "status"
 */
export const STATUS_FILTER_OPTIONS = [
  { value: STATUS_VALUES.ALL, label: 'Todos' },
  { value: STATUS_VALUES.ATIVO, label: 'Ativo' },
  { value: STATUS_VALUES.INATIVO, label: 'Inativo' },
];

/**
 * Opções de filtro para entidades com campo "is_active"
 */
export const IS_ACTIVE_FILTER_OPTIONS = [
  { value: IS_ACTIVE_VALUES.ALL, label: 'Todos' },
  { value: IS_ACTIVE_VALUES.ACTIVE, label: 'Ativo' },
  { value: IS_ACTIVE_VALUES.INACTIVE, label: 'Inativo' },
];

/**
 * Função auxiliar para obter label de um status
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case STATUS_VALUES.ATIVO:
    case IS_ACTIVE_VALUES.ACTIVE:
      return 'Ativo';
    case STATUS_VALUES.INATIVO:
    case IS_ACTIVE_VALUES.INACTIVE:
      return 'Inativo';
    case STATUS_VALUES.ALL:
    case IS_ACTIVE_VALUES.ALL:
      return 'Todos';
    default:
      return status;
  }
}

/**
 * Tipos TypeScript para os status
 */
export type StatusValue = typeof STATUS_VALUES[keyof typeof STATUS_VALUES];
export type IsActiveValue = typeof IS_ACTIVE_VALUES[keyof typeof IS_ACTIVE_VALUES];
