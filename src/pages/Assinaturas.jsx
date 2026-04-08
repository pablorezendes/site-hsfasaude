import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import '../styles/Assinaturas.css'

function Assinaturas() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Esconder spinner após carregamento
    const spinner = document.getElementById('spinner')
    if (spinner) {
      setTimeout(() => {
        spinner.classList.remove('show')
      }, 500)
    }

    // Carregar conteúdo do carimbo.html
    const loadContent = async () => {
      try {
        const response = await fetch('/assinaturas/api/conteudo')

        // Verificar se a resposta HTTP foi bem-sucedida
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Erro desconhecido')
          if (import.meta.env.DEV) console.error(`Erro HTTP ${response.status}:`, errorText.substring(0, 200))
          throw new Error(`Erro ao carregar conteúdo: ${response.status} ${response.statusText}`)
        }

        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text()
          if (import.meta.env.DEV) console.error('Resposta não é JSON:', text.substring(0, 200))
          throw new Error('A API retornou HTML ao invés de JSON. Verifique se o servidor está rodando na porta 3000.')
        }

        const data = await response.json()

        if (data.success) {
          // Remover estilos inline do server (serão substituídos pelo CSS do React)
          // mantendo apenas a estrutura HTML com event handlers
          let cleanHtml = data.html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

          // Sanitizar HTML mantendo funcionalidade do formulário
          // --- Security: Removed dangerous on* event handler attributes from DOMPurify config ---
          // on* attributes (onclick, onblur, etc.) defeat XSS sanitization entirely
          // Os event listeners são re-adicionados programaticamente após a injeção dos scripts
          setContent(DOMPurify.sanitize(cleanHtml, {
            ADD_TAGS: ['optgroup', 'canvas'],
            ADD_ATTR: ['target', 'rel', 'tabindex', 'data-*'],
            ALLOW_DATA_ATTR: true,
            FORCE_BODY: true,
          }))
          setLoading(false) // Atualizar loading imediatamente após receber o conteúdo

          // Executar scripts após um pequeno delay para garantir que o DOM está pronto
          setTimeout(() => {
            if (data.scripts && data.scripts.length > 0) {
              data.scripts.forEach(scriptTag => {
                // Extrair apenas o conteúdo do script (sem as tags)
                let scriptContent = scriptTag.replace(/<script[^>]*>([\s\S]*?)<\/script>/i, '$1')

                // Substituir referências antigas à API PHP pela nova API Node.js
                scriptContent = scriptContent.replace(
                  /fetch\(['"]salvar_assinatura\.php['"]/g,
                  "fetch('/assinaturas/api/salvar'"
                )
                scriptContent = scriptContent.replace(
                  /fetch\(['"]\/assinaturas\/salvar_assinatura\.php['"]/g,
                  "fetch('/assinaturas/api/salvar'"
                )

                // Substituir FormData por JSON - versão mais robusta
                // Substituir criação do FormData
                scriptContent = scriptContent.replace(
                  /const formData = new FormData\(\);\s*formData\.append\(['"]nome['"], nome\);\s*formData\.append\(['"]cargo['"], cargo\);\s*formData\.append\(['"]empresa['"], empresa\);\s*formData\.append\(['"]registro['"], registro\);\s*formData\.append\(['"]imagem['"], imagemBase64\);/g,
                  `const dados = {
                nome: nome,
                cargo: cargo || '',
                empresa: empresa || '',
                registro: registro || '',
                imagem: imagemBase64
            };`
                )

                // Substituir body: formData (versão mais flexível)
                scriptContent = scriptContent.replace(
                  /body:\s*formData/g,
                  `body: JSON.stringify(dados),
                    headers: {
                        'Content-Type': 'application/json'
                    }`
                )

                // Adicionar verificação de resposta HTTP antes de fazer parse JSON
                scriptContent = scriptContent.replace(
                  /const resultado = await response\.json\(\);/g,
                  `if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Erro ao processar resposta do servidor' }));
                    throw new Error(errorData.message || \`Erro HTTP: \${response.status}\`);
                }

                const resultado = await response.json();`
                )

                if (scriptContent.trim()) {
                  try {
                    // Criar e executar o script dentro do container do conteúdo
                    const container = document.querySelector('#carimbo-content')
                    const script = document.createElement('script')
                    script.textContent = scriptContent
                    if (container) {
                      container.appendChild(script)
                      container.removeChild(script)
                    } else {
                      document.body.appendChild(script)
                      document.body.removeChild(script)
                    }
                  } catch (error) {
                    console.error('Erro ao executar script:', error)
                  }
                }
              })
            }

            // FIX: DOMPurify remove todos os atributos on* (onclick, onblur, onchange)
            // do HTML para segurança contra XSS. Precisamos re-adicionar os event
            // listeners programaticamente após os scripts terem sido executados.
            const container = document.querySelector('#carimbo-content')
            if (container) {
              // Botões - buscar por texto do conteúdo e re-conectar handlers
              const buttons = container.querySelectorAll('button')
              buttons.forEach(btn => {
                const text = btn.textContent.trim().toLowerCase()
                if (text.includes('limpar')) {
                  btn.addEventListener('click', () => {
                    if (typeof window.clearSignature === 'function') window.clearSignature()
                  })
                } else if (text.includes('desfazer')) {
                  btn.addEventListener('click', () => {
                    if (typeof window.undoSignature === 'function') window.undoSignature()
                  })
                } else if (text.includes('atualizar') && text.includes('visualiza')) {
                  btn.addEventListener('click', () => {
                    if (typeof window.updatePreview === 'function') window.updatePreview()
                  })
                } else if (text.includes('salvar')) {
                  btn.addEventListener('click', () => {
                    if (typeof window.salvarNoServidor === 'function') window.salvarNoServidor()
                  })
                }
              })

              // Input nome - onblur -> capitalizarNome()
              const nomeInput = container.querySelector('#nome')
              if (nomeInput) {
                nomeInput.addEventListener('blur', () => {
                  if (typeof window.capitalizarNome === 'function') window.capitalizarNome()
                })
              }

              // Checkbox semRegistro - onchange -> toggleRegistro()
              const semRegistroCheckbox = container.querySelector('#semRegistro')
              if (semRegistroCheckbox) {
                semRegistroCheckbox.addEventListener('change', () => {
                  if (typeof window.toggleRegistro === 'function') window.toggleRegistro()
                })
              }

              // Select tipoRegistro - onchange -> atualizarRegistro()
              const tipoRegistroSelect = container.querySelector('#tipoRegistro')
              if (tipoRegistroSelect) {
                tipoRegistroSelect.addEventListener('change', () => {
                  if (typeof window.atualizarRegistro === 'function') window.atualizarRegistro()
                })
              }

              // Input numRegistro - onblur -> atualizarRegistro()
              const numRegistroInput = container.querySelector('#numRegistro')
              if (numRegistroInput) {
                numRegistroInput.addEventListener('blur', () => {
                  if (typeof window.atualizarRegistro === 'function') window.atualizarRegistro()
                })
              }

              // Select estadoRegistro - onchange -> atualizarRegistro()
              const estadoRegistroSelect = container.querySelector('#estadoRegistro')
              if (estadoRegistroSelect) {
                estadoRegistroSelect.addEventListener('change', () => {
                  if (typeof window.atualizarRegistro === 'function') window.atualizarRegistro()
                })
              }
            }
          }, 300)

          // Fix mobile: canvas setup + proteção contra resize que limpa assinatura
          setTimeout(() => {
            const sigCanvas = document.getElementById('signatureCanvas')
            if (sigCanvas) {
              sigCanvas.style.touchAction = 'none'

              // FIX CRÍTICO: Impedir que o resize (scroll mobile mostra/esconde
              // barra de endereço) limpe a assinatura do canvas.
              // Salva o conteúdo antes do resize e restaura depois.
              let resizeTimer = null

              window.addEventListener('resize', () => {
                const ctx = sigCanvas.getContext('2d')
                if (!ctx) return

                // Salvar conteúdo atual do canvas
                const imageData = ctx.getImageData(0, 0, sigCanvas.width, sigCanvas.height)
                const savedWidth = sigCanvas.width
                const savedHeight = sigCanvas.height

                // Cancelar restauração anterior se resize em sequência
                if (resizeTimer) clearTimeout(resizeTimer)

                // Restaurar após o resize completar
                resizeTimer = setTimeout(() => {
                  // Se dimensões mudaram, restaurar o conteúdo
                  if (sigCanvas.width !== savedWidth || sigCanvas.height !== savedHeight) {
                    // Canvas foi redimensionado, criar canvas temporário
                    const tempCanvas = document.createElement('canvas')
                    tempCanvas.width = savedWidth
                    tempCanvas.height = savedHeight
                    tempCanvas.getContext('2d').putImageData(imageData, 0, 0)
                    // Desenhar no canvas redimensionado
                    ctx.drawImage(tempCanvas, 0, 0, savedWidth, savedHeight, 0, 0, sigCanvas.width, sigCanvas.height)
                  } else {
                    // Mesmo tamanho, apenas restaurar
                    ctx.putImageData(imageData, 0, 0)
                  }
                }, 100)
              }, true) // capture phase para rodar ANTES do handler do carimbo
            }

            const previewCanvas = document.getElementById('previewCanvas')
            if (previewCanvas) {
              previewCanvas.style.touchAction = 'auto'
              previewCanvas.style.pointerEvents = 'none'
              previewCanvas.setAttribute('width', '400')
              previewCanvas.setAttribute('height', '500')
              previewCanvas.style.maxWidth = '100%'
              previewCanvas.style.height = 'auto'

              if (typeof window.updatePreview === 'function') {
                window.updatePreview()
              }
            }
          }, 500)
        } else {
          setLoading(false)
          console.error('API retornou sucesso=false:', data.message)
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error)
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  return (
    <>
      {/* Sistema Container Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="sistema-container"
            style={{
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
              padding: 0,
              margin: 0,
              width: '100%',
              overflowX: 'hidden',
              overflowY: 'auto'
            }}
          >
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : (
              <div
                id="carimbo-content"
                className="carimbo-wrapper"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: 'white'
                }}
              />
            )}
          </div>
        </div>
      </div>
      {/* Sistema Container End */}
    </>
  )
}

export default Assinaturas
