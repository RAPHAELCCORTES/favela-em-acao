from django.urls import path
from .views import home, listar_projetos, listar_campanhas, listar_comentarios, criar_comentario, criar_contato, login_admin, logout_admin, status_admin, salvar_projeto, salvar_campanha, excluir_campanha, upload_home_banner, excluir_projeto, dashboard_admin, obter_home, salvar_home, listar_contatos_admin, excluir_comentario, excluir_contato

urlpatterns = [
    path('', home, name='home'),
    path('api/projetos/', listar_projetos, name='api_projetos'),
    path('api/campanhas/', listar_campanhas, name='api_campanhas'),
    path('api/comentarios/', listar_comentarios, name='api_comentarios'),
    path('api/comentarios/criar/', criar_comentario, name='api_criar_comentario'),
    path('api/contato/criar/', criar_contato, name='api_criar_contato'),
    path('api/admin/login/', login_admin, name='api_admin_login'),
    path('api/admin/logout/', logout_admin, name='api_admin_logout'),
    path('api/admin/status/', status_admin, name='api_admin_status'),
    path('api/projetos/salvar/', salvar_projeto, name='api_salvar_projeto'),
    path('api/campanhas/salvar/', salvar_campanha, name='api_salvar_campanha'),
    path('api/campanhas/excluir/<int:campanha_id>/', excluir_campanha, name='api_excluir_campanha'),
    path('api/home/banner/upload/', upload_home_banner, name='api_home_banner_upload'),
    path('api/projetos/excluir/<int:projeto_id>/', excluir_projeto, name='api_excluir_projeto'),
    path('api/admin/dashboard/', dashboard_admin, name='api_admin_dashboard'),
    path('api/home/', obter_home, name='api_home'),
    path('api/home/salvar/', salvar_home, name='api_salvar_home'),
    path('api/admin/contatos/', listar_contatos_admin, name='api_admin_contatos'),
    path('api/comentarios/excluir/<int:comentario_id>/', excluir_comentario, name='api_excluir_comentario'),
    path('api/contatos/excluir/<int:contato_id>/', excluir_contato, name='api_excluir_contato'),
]