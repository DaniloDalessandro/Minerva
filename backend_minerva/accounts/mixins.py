from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model

User = get_user_model()

class HierarchicalFilterMixin:
    """
    Mixin para filtrar objetos baseado na hierarquia organizacional do usuário
    
    Implementa a lógica:
    - Presidente → vê tudo
    - Diretor → vê objetos das direções associadas aos centros de custo da sua direção
    - Gerente → vê objetos das gerências associadas aos centros de custo da sua gerência  
    - Coordenador → vê objetos da sua coordenação associada aos centros de custo
    """
    
    def get_user_hierarchy_level(self, user):
        """Determina o nível hierárquico do usuário"""
        if not hasattr(user, 'employee') or not user.employee:
            return None, None
            
        employee = user.employee
        
        # Verifica se é presidente (pode ser determinado por grupos/permissões especiais)
        if user.groups.filter(name='Presidente').exists() or user.is_superuser:
            return 'president', None
            
        # Verifica coordenação
        if hasattr(employee, 'coordination') and employee.coordination:
            return 'coordination', employee.coordination
            
        # Verifica gerência
        if hasattr(employee, 'management') and employee.management:
            return 'management', employee.management
            
        # Verifica direção
        if hasattr(employee, 'direction') and employee.direction:
            return 'direction', employee.direction
            
        return None, None
    
    def get_accessible_management_centers(self, user):
        """Retorna queryset dos centros gestores acessíveis ao usuário"""
        from center.models import Management_Center, CenterHierarchy
        import logging
        
        logger = logging.getLogger(__name__)
        
        hierarchy_level, hierarchy_object = self.get_user_hierarchy_level(user)
        logger.info(f"User {user.email}: hierarchy_level={hierarchy_level}, hierarchy_object={hierarchy_object}")
        
        if hierarchy_level == 'president':
            # Presidente vê tudo
            centers = Management_Center.objects.all()
            logger.info(f"User {user.email} is president - access to all {centers.count()} centers")
            return centers
            
        elif hierarchy_level == 'direction':
            # Diretor vê centros de sua direção
            centers = Management_Center.objects.filter(
                hierarchy_associations__direction=hierarchy_object
            ).distinct()
            logger.info(f"User {user.email} is director - access to {centers.count()} centers")
            return centers
            
        elif hierarchy_level == 'management':
            # Gerente vê centros de sua gerência
            centers = Management_Center.objects.filter(
                hierarchy_associations__management=hierarchy_object
            ).distinct()
            logger.info(f"User {user.email} is manager - access to {centers.count()} centers")
            return centers
            
        elif hierarchy_level == 'coordination':
            # Coordenador vê centros de sua coordenação
            centers = Management_Center.objects.filter(
                hierarchy_associations__coordination=hierarchy_object
            ).distinct()
            logger.info(f"User {user.email} is coordinator - access to {centers.count()} centers")
            return centers
            
        # Se não tem hierarquia definida, não vê nada
        logger.warning(f"User {user.email} has no defined hierarchy - no access to centers")
        
        # Verificar se é superuser sem hierarquia definida
        if user.is_superuser:
            logger.warning(f"Superuser {user.email} without hierarchy - granting access to all centers")
            return Management_Center.objects.all()
            
        return Management_Center.objects.none()
    
    def get_accessible_requesting_centers(self, user):
        """Retorna queryset dos centros solicitantes acessíveis ao usuário"""
        from center.models import Requesting_Center
        
        accessible_management_centers = self.get_accessible_management_centers(user)
        return Requesting_Center.objects.filter(
            management_center__in=accessible_management_centers
        )
    
    def filter_queryset_by_hierarchy(self, queryset, user, center_field='management_center'):
        """
        Filtra um queryset baseado na hierarquia do usuário
        
        Args:
            queryset: QuerySet a ser filtrado
            user: Usuário para aplicar filtro
            center_field: Nome do campo que relaciona com centro gestor
        """
        accessible_centers = self.get_accessible_management_centers(user)
        
        filter_kwargs = {f"{center_field}__in": accessible_centers}
        return queryset.filter(**filter_kwargs)
    
    def get_hierarchical_employees_queryset(self, user):
        """Retorna funcionários visíveis baseado na hierarquia"""
        from employee.models import Employee
        
        hierarchy_level, hierarchy_object = self.get_user_hierarchy_level(user)
        
        if hierarchy_level == 'president':
            # Presidente vê todos
            return Employee.objects.all()
            
        elif hierarchy_level == 'direction':
            # Diretor vê funcionários da sua direção e subordinados
            return Employee.objects.filter(
                Q(direction=hierarchy_object) |
                Q(management__direction=hierarchy_object) |
                Q(coordination__management__direction=hierarchy_object)
            ).distinct()
            
        elif hierarchy_level == 'management':
            # Gerente vê funcionários da sua gerência e coordenações subordinadas
            return Employee.objects.filter(
                Q(management=hierarchy_object) |
                Q(coordination__management=hierarchy_object)
            ).distinct()
            
        elif hierarchy_level == 'coordination':
            # Coordenador vê apenas funcionários da sua coordenação
            return Employee.objects.filter(
                coordination=hierarchy_object
            )
            
        return Employee.objects.none()


class HierarchicalPermissionMixin(models.Model):
    """
    Mixin para modelos que precisam de permissões hierárquicas
    Adiciona métodos para verificar permissões baseadas na estrutura organizacional
    """
    
    class Meta:
        abstract = True
    
    def user_can_view(self, user):
        """Verifica se usuário pode visualizar este objeto"""
        mixin = HierarchicalFilterMixin()
        
        # Se o modelo tem centro gestor, usar filtro hierárquico
        if hasattr(self, 'management_center'):
            accessible_centers = mixin.get_accessible_management_centers(user)
            return self.management_center in accessible_centers
            
        # Se o modelo tem centro solicitante, verificar via centro gestor
        elif hasattr(self, 'requesting_center') and self.requesting_center:
            accessible_centers = mixin.get_accessible_management_centers(user)
            return self.requesting_center.management_center in accessible_centers
            
        # Se é um funcionário, usar filtro de funcionários
        elif hasattr(self, 'direction') or hasattr(self, 'management') or hasattr(self, 'coordination'):
            accessible_employees = mixin.get_hierarchical_employees_queryset(user)
            return self in accessible_employees
            
        return False
    
    def user_can_edit(self, user):
        """Verifica se usuário pode editar este objeto"""
        # Por padrão, quem pode ver pode editar
        # Pode ser sobrescrito para lógicas mais específicas
        return self.user_can_view(user)
    
    def user_can_delete(self, user):
        """Verifica se usuário pode deletar este objeto"""
        # Por padrão, quem pode ver pode deletar
        # Pode ser sobrescrito para lógicas mais específicas
        return self.user_can_view(user)
    
    @classmethod
    def get_accessible_objects(cls, user):
        """Retorna queryset de objetos acessíveis ao usuário"""
        mixin = HierarchicalFilterMixin()
        queryset = cls.objects.all()
        
        # Se o modelo tem centro gestor
        if hasattr(cls, '_meta') and any(f.name == 'management_center' for f in cls._meta.fields):
            return mixin.filter_queryset_by_hierarchy(queryset, user, 'management_center')
            
        # Se o modelo tem centro solicitante
        elif hasattr(cls, '_meta') and any(f.name == 'requesting_center' for f in cls._meta.fields):
            return mixin.filter_queryset_by_hierarchy(queryset, user, 'requesting_center__management_center')
            
        # Se é modelo de funcionário
        elif cls.__name__ == 'Employee':
            return mixin.get_hierarchical_employees_queryset(user)
            
        return queryset.none()