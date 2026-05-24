import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from .models import Projeto, Campanha, Comentario, Contato, ConfiguracaoSite, ProjetoImagem, CampanhaImagem
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage

def arquivo_eh_imagem(arquivo):
    tipos_permitidos = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ]

    return arquivo.content_type in tipos_permitidos

def arquivo_tamanho_valido(arquivo):
    limite_mb = 5
    limite_bytes = limite_mb * 1024 * 1024

    return arquivo.size <= limite_bytes

@ensure_csrf_cookie
def home(request):

    config = ConfiguracaoSite.objects.first()

    context = {
        'config': config
    }

    return render(request, 'ong/index.html', context)

from django.http import JsonResponse
from .models import Projeto, Campanha, Comentario, Contato


def listar_projetos(request):
    projetos = Projeto.objects.all()

    data = []

    for p in projetos:
        galeria = [img.imagem.url for img in p.galeria.all()]

        data.append({
            'id': p.id,
            'title': p.titulo,
            'desc': p.descricao,
            'category': p.categoria,
            'img': p.imagem.url if p.imagem else '',
            'gallery': galeria
        })

    return JsonResponse(data, safe=False)


def listar_campanhas(request):
    campanhas = Campanha.objects.all()

    data = []

    for c in campanhas:
        galeria = [img.imagem.url for img in c.galeria.all()]

        data.append({
            'id': c.id,
            'title': c.titulo,
            'obj': c.objetivo,
            'img': c.imagem.url if c.imagem else '',
            'gallery': galeria
        })

    return JsonResponse(data, safe=False)

def listar_comentarios(request):
    comentarios = Comentario.objects.all().order_by('-criado_em')

    data = []

    for c in comentarios:
        data.append({
            'id': c.id,
            'name': c.nome,
            'text': c.texto
        })

    return JsonResponse(data, safe=False)

def criar_comentario(request):
    if request.method == 'POST':
        body = json.loads(request.body)

        comentario = Comentario.objects.create(
            nome=body.get('name', ''),
            texto=body.get('text', '')
        )

        return JsonResponse({
            'success': True,
            'id': comentario.id,
            'name': comentario.nome,
            'text': comentario.texto
        })

    return JsonResponse({'success': False, 'message': 'Método não permitido'})

def criar_contato(request):
    if request.method == 'POST':
        body = json.loads(request.body)

        contato = Contato.objects.create(
            nome=body.get('name', ''),
            telefone=body.get('phone', ''),
            mensagem=body.get('message', '')
        )

        return JsonResponse({
            'success': True,
            'id': contato.id,
            'name': contato.nome,
            'phone': contato.telefone,
            'message': contato.mensagem
        })

    return JsonResponse({'success': False, 'message': 'Método não permitido'})

def login_admin(request):
    if request.method == 'POST':
        body = json.loads(request.body)

        username = body.get('username', '')
        password = body.get('password', '')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({
                'success': True,
                'message': 'Login realizado com sucesso'
            })

        return JsonResponse({
            'success': False,
            'message': 'Usuário ou senha inválidos'
        })

    return JsonResponse({'success': False, 'message': 'Método não permitido'})


def logout_admin(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({
            'success': True,
            'message': 'Logout realizado com sucesso'
        })

    return JsonResponse({'success': False, 'message': 'Método não permitido'})


def status_admin(request):
    return JsonResponse({
        'is_authenticated': request.user.is_authenticated,
        'username': request.user.username if request.user.is_authenticated else ''
    })

@login_required
def salvar_projeto(request):
    if request.method == 'POST':

        projeto_id = request.POST.get('id')

        titulo = request.POST.get('title', '')
        descricao = request.POST.get('desc', '')
        categoria = request.POST.get('category', '')

        imagem = request.FILES.get('img')

        if projeto_id:

            projeto = Projeto.objects.get(id=projeto_id)

            projeto.titulo = titulo
            projeto.descricao = descricao
            projeto.categoria = categoria

        else:

            projeto = Projeto.objects.create(
                titulo=titulo,
                descricao=descricao,
                categoria=categoria
            )

        if imagem:
            projeto.imagem = imagem

        projeto.save()

            if imagem:

                if not arquivo_eh_imagem(imagem):
                    return JsonResponse({
                        'success': False,
                        'message': 'Formato inválido. Envie JPG, PNG ou WEBP.'
                    })

                if not arquivo_tamanho_valido(imagem):
                    return JsonResponse({
                        'success': False,
                        'message': 'Imagem muito grande. Máximo de 5 MB.'
                    })

                projeto.imagem = imagem

            projeto.save()

            return JsonResponse({
                'success': True
            })

        imagens_galeria = request.FILES.getlist('gallery')

        imagens_atuais = projeto.galeria.count()

        if imagens_atuais + len(imagens_galeria) > 10:
            return JsonResponse({
                'success': False,
                'message': 'Cada projeto pode ter no máximo 10 imagens.'
            })

        for imagem_extra in imagens_galeria:

            if not arquivo_eh_imagem(imagem_extra):
                return JsonResponse({
                    'success': False,
                    'message': 'Uma das imagens da galeria está em formato inválido.'
                })

            if not arquivo_tamanho_valido(imagem_extra):
                return JsonResponse({
                    'success': False,
                    'message': 'Uma das imagens da galeria ultrapassa 5 MB.'
                })

            ProjetoImagem.objects.create(
                projeto=projeto,
                imagem=imagem_extra
            )

        return JsonResponse({
            'success': True,
            'id': projeto.id,
            'title': projeto.titulo,
            'desc': projeto.descricao,
            'category': projeto.categoria,
            'img': projeto.imagem.url if projeto.imagem else ''
        })

    return JsonResponse({'success': False, 'message': 'Método não permitido'})

@login_required
def excluir_projeto(request, projeto_id):
    if request.method == 'DELETE':
        try:
            projeto = Projeto.objects.get(id=projeto_id)
            projeto.delete()

            return JsonResponse({
                'success': True
            })

        except Projeto.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Projeto não encontrado'
            })

    return JsonResponse({
        'success': False,
        'message': 'Método não permitido'
    })

@login_required
def salvar_campanha(request):
    if request.method == 'POST':
        campanha_id = request.POST.get('id')
        titulo = request.POST.get('title', '')
        objetivo = request.POST.get('obj', '')
        imagem = request.FILES.get('img')

        if campanha_id:
            campanha = Campanha.objects.get(id=campanha_id)
            campanha.titulo = titulo
            campanha.objetivo = objetivo

            if imagem:
                if not arquivo_eh_imagem(imagem):
                    return JsonResponse({
                        'success': False,
                        'message': 'Formato inválido. Envie apenas JPG, PNG ou WEBP.'
                    })

                if not arquivo_tamanho_valido(imagem):
                    return JsonResponse({
                        'success': False,
                        'message': 'Imagem muito grande. Envie arquivos de até 5 MB.'
                    })

            campanha.save()
        else:
            campanha = Campanha.objects.create(
                titulo=titulo,
                objetivo=objetivo,
                imagem=imagem
            )

        imagens_galeria = request.FILES.getlist('gallery')

        imagens_atuais = campanha.galeria.count()

        if imagens_atuais + len(imagens_galeria) > 10:
            return JsonResponse({
                'success': False,
                'message': 'Cada campanha pode ter no máximo 10 imagens.'
            })

        for imagem_extra in imagens_galeria:

            if not arquivo_eh_imagem(imagem_extra):
                return JsonResponse({
                    'success': False,
                    'message': 'Uma das imagens da galeria está em formato inválido.'
                })

            if not arquivo_tamanho_valido(imagem_extra):
                return JsonResponse({
                    'success': False,
                    'message': 'Uma das imagens da galeria ultrapassa 5 MB.'
                })

            CampanhaImagem.objects.create(
                campanha=campanha,
                imagem=imagem_extra
            )

        return JsonResponse({
            'success': True,
            'id': campanha.id,
            'title': campanha.titulo,
            'obj': campanha.objetivo,
            'img': campanha.imagem.url if campanha.imagem else ''
        })

    return JsonResponse({'success': False, 'message': 'Método não permitido'})

@login_required
def excluir_campanha(request, campanha_id):
    if request.method == 'DELETE':
        try:
            campanha = Campanha.objects.get(id=campanha_id)
            campanha.delete()

            return JsonResponse({
                'success': True
            })

        except Campanha.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Campanha não encontrada'
            })

    return JsonResponse({
        'success': False,
        'message': 'Método não permitido'
    })

@login_required
def upload_home_banner(request):
    if request.method == 'POST':
        imagem = request.FILES.get('img')

        if not imagem:
            return JsonResponse({
                'success': False,
                'message': 'Nenhuma imagem enviada'
            })

        caminho = default_storage.save(f'home/{imagem.name}', imagem)

        return JsonResponse({
            'success': True,
            'img': f'/media/{caminho}'
        })

    return JsonResponse({
        'success': False,
        'message': 'Método não permitido'
    })

@login_required
def dashboard_admin(request):
    return JsonResponse({
        'projetos': Projeto.objects.count(),
        'campanhas': Campanha.objects.count(),
        'comentarios': Comentario.objects.count(),
        'contatos': Contato.objects.count(),
    })

def obter_home(request):
    config = ConfiguracaoSite.objects.first()

    if not config:
        return JsonResponse({
            'title': "Transformando Realidades <br/>com Cultura e Ação Social",
            'teaser': "O Coletivo Favela em Ação atua transformando vidas na comunidade, promovendo educação, cultura e assistência para quem mais precisa.",
            'heroImg': "/static/assets/hero.png"
        })

    return JsonResponse({
        'title': config.titulo_home,
        'teaser': config.subtitulo_home,
        'heroImg': config.imagem_home.url if config.imagem_home else "/static/assets/hero.png"
    })

@login_required
def salvar_home(request):
    if request.method == 'POST':
        config = ConfiguracaoSite.objects.first()

        if not config:
            config = ConfiguracaoSite.objects.create()

        titulo = request.POST.get('title', '')
        subtitulo = request.POST.get('teaser', '')
        imagem = request.FILES.get('img')

        config.titulo_home = titulo
        config.subtitulo_home = subtitulo

        if imagem:
            if not arquivo_eh_imagem(imagem):
                return JsonResponse({
                    'success': False,
                    'message': 'Formato inválido. Envie apenas JPG, PNG ou WEBP.'
                })

            if not arquivo_tamanho_valido(imagem):
                return JsonResponse({
                    'success': False,
                    'message': 'Imagem muito grande. Envie arquivos de até 5 MB.'
                })

        config.save()

        return JsonResponse({
            'success': True,
            'title': config.titulo_home,
            'teaser': config.subtitulo_home,
            'heroImg': config.imagem_home.url if config.imagem_home else "/static/assets/hero.png"
        })

    return JsonResponse({
        'success': False,
        'message': 'Método não permitido'
    })

@login_required
def listar_contatos_admin(request):
    contatos = Contato.objects.all().order_by('-enviado_em')

    data = []

    for c in contatos:
        data.append({
            'id': c.id,
            'nome': c.nome,
            'telefone': c.telefone,
            'mensagem': c.mensagem,
            'enviado_em': c.enviado_em.strftime('%d/%m/%Y %H:%M')
        })

    return JsonResponse(data, safe=False)


@login_required
def excluir_comentario(request, comentario_id):
    if request.method == 'DELETE':
        try:
            comentario = Comentario.objects.get(id=comentario_id)
            comentario.delete()

            return JsonResponse({'success': True})

        except Comentario.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Comentário não encontrado'
            })

    return JsonResponse({
        'success': False,
        'message': 'Método não permitido'
    })

@login_required
def excluir_contato(request, contato_id):
    if request.method == 'DELETE':
        try:
            contato = Contato.objects.get(id=contato_id)
            contato.delete()

            return JsonResponse({'success': True})

        except Contato.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Contato não encontrado'
            })

    return JsonResponse({
        'success': False,
        'message': 'Método não permitido'
    })