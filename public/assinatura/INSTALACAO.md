# 🚀 INSTALAÇÃO RÁPIDA - Sistema de Assinatura Digital

## ✅ Passo 1: Verificar Arquivos

Os seguintes arquivos devem estar em `public_html/assinatura/`:

```
✅ index.php              → Página integrada com layout HSFA
✅ carimbo.html           → Sistema de assinatura
✅ salvar_assinatura.php  → Backend PHP
✅ README.md              → Documentação
✅ INSTALACAO.md          → Este arquivo
```

---

## ✅ Passo 2: Criar Pasta de Armazenamento

Execute no terminal (Linux/Unix):

```bash
cd public_html/assinatura
mkdir -p assinatura
chmod 777 assinatura
```

Ou crie manualmente:
1. Acesse `public_html/assinatura/`
2. Crie uma pasta chamada `assinatura`
3. Dê permissões de escrita (777 ou 755)

---

## ✅ Passo 3: Verificar PHP

O servidor precisa:
- **PHP 7.4+**
- Extensões: `gd`, `fileinfo`

### Testar PHP

Crie um arquivo `test.php` em `public_html/assinatura/`:

```php
<?php
phpinfo();
?>
```

Acesse: `http://seusite.com/assinatura/test.php`

Verifique se:
- ✅ PHP Version ≥ 7.4
- ✅ GD Support: enabled
- ✅ Fileinfo Support: enabled

**Depois apague o arquivo test.php por segurança!**

---

## ✅ Passo 4: Configurar Permissões (Importante!)

### Linux/Unix (SSH):

```bash
cd public_html/assinatura
chmod 644 *.php
chmod 644 *.html
chmod 644 *.md
chmod 777 assinatura/
```

### Windows (Painel de Controle):

1. Clique direito na pasta `assinatura/assinatura/`
2. Propriedades → Segurança
3. Editar → Adicionar
4. Digite: `IIS_IUSRS`
5. Marque: "Controle Total"
6. OK → Aplicar

### cPanel (Hosting Compartilhado):

1. Acesse File Manager
2. Navegue até `public_html/assinatura/`
3. Clique direito na pasta `assinatura`
4. "Change Permissions"
5. Digite: `777`
6. Save

---

## ✅ Passo 5: Testar o Sistema

### Teste 1: Página Integrada

Acesse no navegador:
```
http://seusite.com/assinatura/
```

**Deve mostrar:**
- ✅ Menu de navegação do HSFA
- ✅ Header com logo
- ✅ Sistema de assinatura embutido
- ✅ Footer com informações

### Teste 2: Sistema Direto

Acesse no navegador:
```
http://seusite.com/assinatura/carimbo.html
```

**Deve mostrar:**
- ✅ Formulário de dados
- ✅ Área de assinatura
- ✅ Botões de ação

### Teste 3: Funcionalidade Completa

1. **Preencher dados:**
   - Digite um nome
   - Preencha campos opcionais

2. **Assinar:**
   - Desenhe com mouse/dedo na área tracejada
   - Verifique se a linha aparece

3. **Salvar:**
   - Clique em "Salvar no Servidor"
   - Aguarde mensagem de sucesso
   - Verifique se arquivo foi criado

4. **Verificar arquivo salvo:**
   - Acesse `public_html/assinatura/assinatura/`
   - Deve conter arquivos `.png` e `.txt`

---

## ✅ Passo 6: Adicionar ao Menu (Opcional)

Para adicionar link no menu principal do site:

**Edite:** `public_html/menu.php`

**Adicione antes do fechamento:**

```php
<a href="assinatura/" class="nav-item nav-link">
    <i class="fas fa-signature"></i> Assinatura Digital
</a>
```

---

## 🔍 Verificação Final

### Checklist Completo:

- [ ] Arquivos copiados para `public_html/assinatura/`
- [ ] Pasta `assinatura/assinatura/` criada
- [ ] Permissões de escrita configuradas (777)
- [ ] PHP 7.4+ instalado
- [ ] Extensões GD e Fileinfo habilitadas
- [ ] Página integrada carrega (`/assinatura/`)
- [ ] Sistema direto carrega (`/assinatura/carimbo.html`)
- [ ] Consegue desenhar assinatura
- [ ] Consegue salvar no servidor
- [ ] Arquivo é criado na pasta
- [ ] Download funciona
- [ ] Responsivo em mobile

---

## ❌ Problemas Comuns e Soluções

### **Erro: "Não foi possível salvar"**

**Causa:** Permissões insuficientes

**Solução:**
```bash
chmod 777 public_html/assinatura/assinatura/
```

### **Erro: "Call to undefined function imagecreatefromstring"**

**Causa:** Extensão GD não instalada

**Solução Linux:**
```bash
sudo apt-get install php-gd
sudo service apache2 restart
```

**Solução cPanel:**
- PHP Selector → Extensions → Marque `gd`

### **Erro: "Failed to load resource"**

**Causa:** Caminhos relativos incorretos

**Solução:** Verifique se está acessando pela URL correta:
- ✅ `http://seusite.com/assinatura/`
- ❌ `http://seusite.com/public_html/assinatura/`

### **Layout quebrado / CSS não carrega**

**Causa:** Caminhos dos arquivos CSS/JS incorretos

**Solução:** Verifique se existem:
- `public_html/css/style.css`
- `public_html/js/main.js`
- `public_html/img/logoBranca.png`

### **Menu não aparece**

**Causa:** Arquivo `menu.php` não encontrado

**Solução:** Verifique se existe:
- `public_html/menu.php`

Se não existir, remova a linha do `index.php`:
```php
<?php include('../menu.php');?>
```

---

## 📋 Comandos Úteis

### Ver permissões (Linux):
```bash
ls -la public_html/assinatura/
```

### Verificar espaço em disco:
```bash
du -sh public_html/assinatura/assinatura/
```

### Contar arquivos salvos:
```bash
ls public_html/assinatura/assinatura/*.png | wc -l
```

### Limpar arquivos antigos (mais de 30 dias):
```bash
find public_html/assinatura/assinatura/ -type f -mtime +30 -delete
```

---

## 🎯 URLs Finais

Após a instalação, o sistema estará disponível em:

### **Página Integrada (Recomendado):**
```
https://hsfasaude.com.br/assinatura/
```

### **Sistema Direto:**
```
https://hsfasaude.com.br/assinatura/carimbo.html
```

### **API de Salvamento:**
```
https://hsfasaude.com.br/assinatura/salvar_assinatura.php
```

---

## 📞 Próximos Passos

1. ✅ **Testar em Produção**
   - Teste no desktop
   - Teste no mobile
   - Teste em diferentes navegadores

2. ✅ **Monitorar**
   - Verifique espaço em disco semanalmente
   - Faça backup dos arquivos salvos

3. ✅ **Divulgar**
   - Adicione link no menu (opcional)
   - Envie URL para equipe
   - Treine usuários

---

## 🎉 Instalação Concluída!

Se todos os testes passaram, o sistema está pronto para uso!

**Acesse:** https://hsfasaude.com.br/assinatura/

---

**Tempo total de instalação:** ~10 minutos  
**Dificuldade:** Fácil  
**Requer SSH:** Não (pode usar cPanel)

---

*Sistema desenvolvido para o Hospital São Francisco de Assis - HSFA-Saúde 🏥*

