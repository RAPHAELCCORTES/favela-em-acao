
from django.db import models


class Projeto(models.Model):
    titulo = models.CharField(max_length=100)
    descricao = models.TextField()
    categoria = models.CharField(max_length=50)
    imagem = models.ImageField(upload_to='projetos/', blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Campanha(models.Model):
    titulo = models.CharField(max_length=100)
    objetivo = models.TextField()
    imagem = models.ImageField(upload_to='campanhas/', blank=True, null=True)

    def __str__(self):
        return self.titulo


class Contato(models.Model):
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20)
    mensagem = models.TextField()
    enviado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome


class Comentario(models.Model):
    nome = models.CharField(max_length=100)
    texto = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class ConfiguracaoSite(models.Model):
    titulo_home = models.CharField(max_length=200, default="Transformando Realidades com Cultura e Ação Social")
    subtitulo_home = models.TextField(default="O Coletivo Favela em Ação atua transformando vidas na comunidade.")
    imagem_home = models.ImageField(upload_to='home/', blank=True, null=True)

    def __str__(self):
        return "Configurações do Site"

class ProjetoImagem(models.Model):
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE, related_name='galeria')
    imagem = models.ImageField(upload_to='projetos/galeria/')
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Imagem de {self.projeto.titulo}"


class CampanhaImagem(models.Model):
    campanha = models.ForeignKey(Campanha, on_delete=models.CASCADE, related_name='galeria')
    imagem = models.ImageField(upload_to='campanhas/galeria/')
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Imagem de {self.campanha.titulo}"

