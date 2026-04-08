# 🏥 Sistema de Assinatura Digital - HSFA-Saúde

## 📍 Integração Completa com o Site

O sistema de assinatura digital foi integrado ao site do Hospital São Francisco de Assis (HSFA-Saúde).

---

## 🌐 Como Acessar

### **URL Principal (com layout do site)**
```
https://seusite.com/assinatura/
```
ou
```
https://seusite.com/assinatura/index.php
```

### **URL Direta (sistema puro)**
```
https://seusite.com/assinatura/carimbo.html
```

---

## 📂 Estrutura de Arquivos

```
public_html/
├── assinatura/
│   ├── index.php              ← Página integrada com o layout do site
│   ├── carimbo.html           ← Sistema de assinatura (standalone)
│   ├── salvar_assinatura.php  ← Backend PHP para salvar
│   └── assinatura/            ← Pasta de armazenamento (criada automaticamente)
│       ├── *.png              ← Imagens das assinaturas
│       └── *.txt              ← Dados das assinaturas
```

---

## 🎨 Integração com o Site

### **index.php** (Página Integrada)
- ✅ Usa o layout padrão do HSFA-Saúde
- ✅ Inclui menu de navegação
- ✅ Inclui topbar com contatos
- ✅ Inclui footer com informações
- ✅ WhatsApp flutuante
- ✅ Responsivo mobile
- ✅ Carrega o sistema via iframe

### **carimbo.html** (Sistema Standalone)
- ✅ Canvas de assinatura otimizado mobile
- ✅ Feedback tátil (vibração)
- ✅ Validações inteligentes
- ✅ Salvar no servidor
- ✅ Download local

---

## 🔧 Configuração do Servidor

### **1. Permissões de Pasta**

O sistema precisa criar a pasta `assinatura/assinatura/` para salvar os arquivos.

**No Linux/Unix:**
```bash
cd public_html/assinatura
chmod 755 .
mkdir -p assinatura
chmod 777 assinatura
```

**No Windows (IIS):**
- Clique direito na pasta `public_html/assinatura`
- Propriedades → Segurança
- Adicionar permissões de escrita para o usuário `IIS_IUSRS`

### **2. PHP Requisitos**

Versão mínima: **PHP 7.4+**

Extensões necessárias:
- ✅ `gd` (para manipulação de imagens)
- ✅ `fileinfo` (para detectar tipos de arquivo)

Verificar no `php.ini`:
```ini
extension=gd
extension=fileinfo
```

### **3. Limites PHP (Recomendado)**

Em `php.ini` ou `.htaccess`:
```ini
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 60
memory_limit = 128M
```

---

## 🔐 Segurança

### **Arquivo `.htaccess` Criado**

O sistema inclui um `.htaccess` na raiz para:
- ❌ Bloquear acesso direto a arquivos .txt
- ✅ Permitir acesso a imagens .png
- ❌ Desabilitar listagem de diretórios
- ❌ Prevenir hotlinking

### **Validações Implementadas**

- ✅ Validação de dados no frontend
- ✅ Validação de dados no backend
- ✅ Proteção contra injeção SQL (não usa banco)
- ✅ Sanitização de nomes de arquivo
- ✅ Validação de imagem base64

---

## 📱 Melhorias Mobile Implementadas

### **Canvas Responsivo**
- ✅ Ajusta automaticamente à largura da tela
- ✅ Altura otimizada (200px em mobile)
- ✅ Espessura de caneta ideal (3px)

### **Feedback Tátil**
- ✅ Vibração ao limpar (100ms)
- ✅ Vibração ao desfazer (50ms)
- ✅ Vibração ao salvar (padrão 100-50-100ms)
- ✅ Vibração ao baixar (padrão 100-50-100ms)

### **Interface**
- ✅ Botões acessíveis (48px altura)
- ✅ Sem zoom indesejado em inputs
- ✅ Layout fluido e responsivo
- ✅ Mensagens otimizadas com emojis

---

## 🚀 Como Adicionar ao Menu do Site (Opcional)

Se quiser adicionar um link no menu principal do site:

**Edite:** `public_html/menu.php`

**Adicione antes da última linha:**
```php
<a href="assinatura/" class="nav-item nav-link">Assinatura Digital</a>
```

**Exemplo completo:**
```php
<div class="navbar-nav">
    <a href="index.php" class="nav-item nav-link">Início</a>
    <a href="quemSomos.php" class="nav-item nav-link">O HSFA</a>
    <a href="guiaPaciente.pdf" target="_blank" class="nav-item nav-link">Guia do Paciente</a>
    <a href="editais.php" class="nav-item nav-link">Editais</a> 
    <a href="exames.php" class="nav-item nav-link">Exames</a>
    <a href="cirurgias.php" class="nav-item nav-link">Cirurgias</a>
    <a href="https://pacs.hsfasaude.com.br/login" class="nav-item nav-link">Resultados Online</a>
    <a href="assinatura/" class="nav-item nav-link">
        <i class="fas fa-signature"></i> Assinatura Digital
    </a>  <!-- NOVO LINK -->
    <a href="contato.php" class="nav-item nav-link">S.A.C</a>
    <a href="pesquisaSatisfacao.php" class="nav-item nav-link">Pesquisa de Satisfação</a>
</div>
```

---

## 🧪 Testar o Sistema

### **1. Testar Página Integrada**
```
http://localhost/assinatura/
ou
http://seudominio.com/assinatura/
```

### **2. Testar Sistema Direto**
```
http://localhost/assinatura/carimbo.html
ou
http://seudominio.com/assinatura/carimbo.html
```

### **3. Checklist de Teste**

- [ ] Página carrega corretamente
- [ ] Menu de navegação funciona
- [ ] Canvas de assinatura aparece
- [ ] Consegue assinar com mouse/dedo
- [ ] Botão "Limpar" funciona
- [ ] Botão "Desfazer" funciona
- [ ] Botão "Atualizar Pré-visualização" funciona
- [ ] Botão "Salvar no Servidor" funciona
- [ ] Botão "Baixar Carimbo" funciona
- [ ] Vibração funciona (mobile)
- [ ] Layout responsivo em mobile

---

## 📊 Monitoramento

### **Arquivos Salvos**

Os arquivos são salvos em:
```
public_html/assinatura/assinatura/
```

**Formato:**
- **Imagem:** `nome_timestamp.png`
- **Dados:** `nome_timestamp.txt`

**Exemplo:**
```
pablo_rodrigues_20251103145230.png
pablo_rodrigues_20251103145230.txt
```

### **Verificar Espaço em Disco**

Cada assinatura ocupa aproximadamente:
- Imagem PNG: 10-50 KB
- Arquivo TXT: 1-2 KB

**Total:** ~12-52 KB por assinatura

---

## 🔧 Troubleshooting

### **Problema: Erro ao salvar**

**Causa:** Permissões de pasta incorretas

**Solução:**
```bash
cd public_html/assinatura
chmod 777 assinatura/
```

### **Problema: Layout quebrado**

**Causa:** Caminhos relativos incorretos

**Solução:** Verifique se todos os arquivos CSS/JS estão acessíveis:
- `../css/style.css`
- `../js/main.js`
- `../img/logoBranca.png`

### **Problema: Menu não aparece**

**Causa:** Arquivo `menu.php` não encontrado

**Solução:** Verifique se o caminho está correto:
```php
<?php include('../menu.php');?>
```

### **Problema: Canvas não funciona no mobile**

**Causa:** JavaScript não carregado ou navegador antigo

**Solução:** 
- Limpe cache do navegador
- Atualize navegador
- Verifique console de erros (F12)

---

## 📞 Suporte

### **Documentação Adicional**

- 📚 `README_MOBILE.md` - Documentação técnica completa
- 📝 `GUIA_MOBILE.md` - Guia do usuário
- 📊 `RESUMO_MOBILE.md` - Visão executiva
- ✅ `CHECKLIST.md` - Checklist de implementação

### **Contato HSFA**

- 📧 Email: sac@hsfasaude.com.br
- 📞 Telefone: (62) 3221-8000
- 📱 WhatsApp: (62) 99647-6186
- 📍 Endereço: R. 9-A - St. Aeroporto, Goiânia - GO

---

## 🎉 Conclusão

O sistema de assinatura digital está 100% integrado ao site do HSFA-Saúde e pronto para uso!

**Acesse agora:**
```
https://seusite.com/assinatura/
```

---

**Versão:** 2.0 Mobile Optimized  
**Data:** Novembro 2025  
**Status:** ✅ INTEGRADO E PRONTO

---

*Desenvolvido para o Hospital São Francisco de Assis - HSFA-Saúde 🏥*

