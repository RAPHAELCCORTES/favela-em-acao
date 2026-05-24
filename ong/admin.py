from django.contrib import admin
from django.utils.html import format_html
from .models import Projeto, Campanha, Contato, Comentario, ConfiguracaoSite, ProjetoImagem, CampanhaImagem


@admin.register(Projeto)
class ProjetoAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'categoria', 'preview_imagem')
    search_fields = ('titulo', 'categoria', 'descricao')
    list_filter = ('categoria',)
    ordering = ('titulo',)

    def preview_imagem(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" width="80" style="border-radius: 6px;" />', obj.imagem.url)
        return "Sem imagem"

    preview_imagem.short_description = 'Imagem'


@admin.register(Campanha)
class CampanhaAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'preview_imagem')
    search_fields = ('titulo', 'objetivo')
    ordering = ('titulo',)

    def preview_imagem(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" width="80" style="border-radius: 6px;" />', obj.imagem.url)
        return "Sem imagem"

    preview_imagem.short_description = 'Imagem'


@admin.register(Contato)
class ContatoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'telefone', 'enviado_em')
    search_fields = ('nome', 'telefone', 'mensagem')
    readonly_fields = ('enviado_em',)
    ordering = ('-enviado_em',)


@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'criado_em')
    search_fields = ('nome', 'texto')
    readonly_fields = ('criado_em',)
    ordering = ('-criado_em',)

@admin.register(ConfiguracaoSite)
class ConfiguracaoSiteAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo_home', 'preview_imagem')

    def preview_imagem(self, obj):
        if obj.imagem_home:
            return format_html('<img src="{}" width="100" style="border-radius: 6px;" />', obj.imagem_home.url)
        return "Sem imagem"

    preview_imagem.short_description = 'Imagem da Home'

@admin.register(ProjetoImagem)
class ProjetoImagemAdmin(admin.ModelAdmin):
    list_display = ('id', 'projeto', 'preview_imagem', 'criado_em')
    search_fields = ('projeto__titulo',)

    def preview_imagem(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" width="80" style="border-radius: 6px;" />', obj.imagem.url)
        return "Sem imagem"

    preview_imagem.short_description = 'Imagem'


@admin.register(CampanhaImagem)
class CampanhaImagemAdmin(admin.ModelAdmin):
    list_display = ('id', 'campanha', 'preview_imagem', 'criado_em')
    search_fields = ('campanha__titulo',)

    def preview_imagem(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" width="80" style="border-radius: 6px;" />', obj.imagem.url)
        return "Sem imagem"

    preview_imagem.short_description = 'Imagem'