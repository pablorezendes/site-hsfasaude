import { useEffect, useState, useRef, useCallback } from 'react'
import DOMPurify from 'dompurify'
import '../styles/Assinaturas.css'

function Assinaturas() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  // Refs to hold mutable drawing state across the component lifecycle
  const stateRef = useRef({
    isDrawing: false,
    currentColor: '#000080',
    currentWidth: 2,
    signatureStrokes: [],
    currentStroke: [],
    hasSignature: false,
    isMobile: false,
  })

  // Ref to track cleanup
  const cleanupRef = useRef(null)

  // ─── All drawing/form logic as plain functions ───────────────────────

  const setupAllLogic = useCallback((container) => {
    if (!container) return

    const s = stateRef.current
    s.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    const signatureCanvas = container.querySelector('#signatureCanvas')
    const signatureCtx = signatureCanvas ? signatureCanvas.getContext('2d') : null
    const placeholder = container.querySelector('#canvasPlaceholder')
    const previewCanvas = container.querySelector('#previewCanvas')

    if (!signatureCanvas || !signatureCtx) return

    // ── Mobile canvas adjustment ──────────────────────────────────────

    function ajustarCanvasParaMobile() {
      if (s.isMobile) {
        const parentContainer = signatureCanvas.parentElement
        const containerWidth = parentContainer.clientWidth - 20
        signatureCanvas.width = Math.min(containerWidth, 600)
        signatureCanvas.height = 140
        s.currentWidth = 3
        const penWidthInput = container.querySelector('#penWidth')
        const penWidthDisplay = container.querySelector('.pen-width-display')
        if (penWidthInput) penWidthInput.value = 3
        if (penWidthDisplay) penWidthDisplay.textContent = '3px'
      }
    }

    ajustarCanvasParaMobile()

    // ── capitalizarNome ───────────────────────────────────────────────

    function capitalizarNome() {
      const nomeInput = container.querySelector('#nome')
      if (!nomeInput) return
      const nome = nomeInput.value
      if (nome) {
        const palavras = nome.toLowerCase().split(' ')
        const nomeCapitalizado = palavras.map(palavra => {
          if (palavra.length > 0) {
            return palavra.charAt(0).toUpperCase() + palavra.slice(1)
          }
          return palavra
        }).join(' ')
        nomeInput.value = nomeCapitalizado
      }
    }

    // ── toggleRegistro ────────────────────────────────────────────────

    function toggleRegistro() {
      const semRegistro = container.querySelector('#semRegistro')
      const tipoRegistro = container.querySelector('#tipoRegistro')
      const numRegistro = container.querySelector('#numRegistro')
      const estadoRegistro = container.querySelector('#estadoRegistro')
      if (!semRegistro || !tipoRegistro || !numRegistro || !estadoRegistro) return

      if (semRegistro.checked) {
        tipoRegistro.disabled = true
        numRegistro.disabled = true
        estadoRegistro.disabled = true
        tipoRegistro.removeAttribute('required')
        numRegistro.removeAttribute('required')
        estadoRegistro.removeAttribute('required')
        const ast1 = container.querySelector('#asteriscoRegistro')
        const ast2 = container.querySelector('#asteriscoNumero')
        const ast3 = container.querySelector('#asteriscoEstado')
        if (ast1) ast1.style.display = 'none'
        if (ast2) ast2.style.display = 'none'
        if (ast3) ast3.style.display = 'none'
        tipoRegistro.value = ''
        numRegistro.value = ''
        estadoRegistro.value = ''
      } else {
        tipoRegistro.disabled = false
        numRegistro.disabled = false
        estadoRegistro.disabled = false
        tipoRegistro.setAttribute('required', 'required')
        numRegistro.setAttribute('required', 'required')
        estadoRegistro.setAttribute('required', 'required')
        const ast1 = container.querySelector('#asteriscoRegistro')
        const ast2 = container.querySelector('#asteriscoNumero')
        const ast3 = container.querySelector('#asteriscoEstado')
        if (ast1) ast1.style.display = 'inline'
        if (ast2) ast2.style.display = 'inline'
        if (ast3) ast3.style.display = 'inline'
        estadoRegistro.value = 'GO'
      }
      atualizarRegistro()
    }

    // ── atualizarRegistro ─────────────────────────────────────────────

    function atualizarRegistro() {
      const semRegistro = container.querySelector('#semRegistro')
      const tipoRegistro = container.querySelector('#tipoRegistro')
      const numRegistro = container.querySelector('#numRegistro')
      const estadoRegistro = container.querySelector('#estadoRegistro')
      const registroHidden = container.querySelector('#registro')
      if (!semRegistro || !tipoRegistro || !numRegistro || !estadoRegistro || !registroHidden) return

      if (semRegistro.checked) {
        registroHidden.value = ''
      } else {
        if (tipoRegistro.value && numRegistro.value && estadoRegistro.value) {
          registroHidden.value = `${tipoRegistro.value} ${numRegistro.value}/${estadoRegistro.value}`
        } else {
          registroHidden.value = ''
        }
      }
      updatePreview()
    }

    // ── desenharCarimboRetangular ─────────────────────────────────────

    function desenharCarimboRetangular(ctx, nome, cargo, empresa, registro, incluirBorda, centerX = 200) {
      let yPos = 30

      if (s.hasSignature) {
        const scale = 0.5
        const scaledWidth = signatureCanvas.width * scale
        const offsetX = centerX - (scaledWidth / 2)
        ctx.save()
        ctx.translate(offsetX, yPos)
        ctx.scale(scale, scale)
        ctx.drawImage(signatureCanvas, 0, 0)
        ctx.restore()
        yPos += (signatureCanvas.height * scale) + 15
      }

      ctx.fillStyle = '#000'
      ctx.textAlign = 'center'

      if (nome) {
        ctx.font = 'bold 18px Arial'
        ctx.fillText(nome, centerX, yPos)
        yPos += 23
      }
      if (cargo) {
        ctx.font = '16px Arial'
        ctx.fillText(cargo, centerX, yPos)
        yPos += 21
      }
      if (empresa) {
        ctx.font = '16px Arial'
        ctx.fillText(empresa, centerX, yPos)
        yPos += 21
      }
      if (registro) {
        ctx.font = '16px Arial'
        ctx.fillText(registro, centerX, yPos)
        yPos += 21
      }

      return yPos + 20
    }

    // ── calcularLarguraMaxima ─────────────────────────────────────────

    function calcularLarguraMaxima(nome, cargo, empresa, registro) {
      const tempCanvas = document.createElement('canvas')
      const ctx = tempCanvas.getContext('2d')
      let maxWidth = 0

      if (nome) {
        ctx.font = 'bold 18px Arial'
        maxWidth = Math.max(maxWidth, ctx.measureText(nome).width)
      }
      if (cargo) {
        ctx.font = '16px Arial'
        maxWidth = Math.max(maxWidth, ctx.measureText(cargo).width)
      }
      if (empresa) {
        ctx.font = '16px Arial'
        maxWidth = Math.max(maxWidth, ctx.measureText(empresa).width)
      }
      if (registro) {
        ctx.font = '16px Arial'
        maxWidth = Math.max(maxWidth, ctx.measureText(registro).width)
      }
      if (s.hasSignature) {
        const signatureWidth = signatureCanvas.width * 0.5
        maxWidth = Math.max(maxWidth, signatureWidth)
      }
      return maxWidth + 60
    }

    // ── updatePreview ─────────────────────────────────────────────────

    function updatePreview() {
      if (!previewCanvas) return
      const ctx = previewCanvas.getContext('2d')

      const nome = (container.querySelector('#nome') || {}).value || ''
      const cargo = (container.querySelector('#cargo') || {}).value || ''
      const empresa = (container.querySelector('#empresa') || {}).value || ''
      const registro = (container.querySelector('#registro') || {}).value || ''

      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)

      // Sync hasSignature with actual canvas content
      if (signatureCanvas && signatureCtx) {
        const imageData = signatureCtx.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height)
        const hasContent = imageData.data.some((channel, index) => {
          return index % 4 !== 3 && channel !== 0
        })
        if (hasContent && !s.hasSignature) {
          s.hasSignature = true
          if (placeholder) placeholder.style.display = 'none'
        } else if (!hasContent && s.hasSignature) {
          s.hasSignature = false
          if (placeholder) placeholder.style.display = 'block'
        }
      }

      desenharCarimboRetangular(ctx, nome, cargo, empresa, registro, false)
    }

    // ── Drawing functions ─────────────────────────────────────────────

    function startDrawing(e) {
      e.preventDefault()
      s.isDrawing = true
      s.hasSignature = true
      if (placeholder) placeholder.style.display = 'none'

      const rect = signatureCanvas.getBoundingClientRect()
      const scaleX = signatureCanvas.width / rect.width
      const scaleY = signatureCanvas.height / rect.height

      const clientX = e.clientX || (e.touches && e.touches[0].clientX)
      const clientY = e.clientY || (e.touches && e.touches[0].clientY)

      const x = (clientX - rect.left) * scaleX
      const y = (clientY - rect.top) * scaleY

      s.currentStroke = [{ x, y, color: s.currentColor, width: s.currentWidth }]

      signatureCtx.beginPath()
      signatureCtx.moveTo(x, y)
    }

    function draw(e) {
      if (!s.isDrawing) return
      e.preventDefault()

      const rect = signatureCanvas.getBoundingClientRect()
      const scaleX = signatureCanvas.width / rect.width
      const scaleY = signatureCanvas.height / rect.height

      const clientX = e.clientX || (e.touches && e.touches[0].clientX)
      const clientY = e.clientY || (e.touches && e.touches[0].clientY)

      const x = (clientX - rect.left) * scaleX
      const y = (clientY - rect.top) * scaleY

      s.currentStroke.push({ x, y, color: s.currentColor, width: s.currentWidth })

      signatureCtx.strokeStyle = s.currentColor
      signatureCtx.lineWidth = s.currentWidth
      signatureCtx.lineCap = 'round'
      signatureCtx.lineJoin = 'round'

      signatureCtx.lineTo(x, y)
      signatureCtx.stroke()
    }

    function stopDrawing() {
      if (s.isDrawing && s.currentStroke.length > 0) {
        s.signatureStrokes.push([...s.currentStroke])
      }
      s.isDrawing = false
      s.currentStroke = []
    }

    // ── clearSignature ────────────────────────────────────────────────

    function clearSignature() {
      if (!s.hasSignature) {
        if (s.isMobile) alert('The signature area is already clean.')
        return
      }
      if (s.isMobile) {
        if (!confirm('Clear the signature?')) return
      }
      signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height)
      s.signatureStrokes = []
      s.hasSignature = false
      if (placeholder) placeholder.style.display = 'block'
      if (s.isMobile && navigator.vibrate) navigator.vibrate(100)
    }

    // ── undoSignature ─────────────────────────────────────────────────

    function undoSignature() {
      if (s.signatureStrokes.length === 0) {
        if (s.isMobile) alert('Nothing to undo.')
        return
      }
      s.signatureStrokes.pop()
      signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height)

      s.signatureStrokes.forEach(stroke => {
        if (stroke.length === 0) return
        signatureCtx.beginPath()
        signatureCtx.moveTo(stroke[0].x, stroke[0].y)
        stroke.forEach((point, index) => {
          if (index === 0) return
          signatureCtx.strokeStyle = point.color
          signatureCtx.lineWidth = point.width
          signatureCtx.lineCap = 'round'
          signatureCtx.lineJoin = 'round'
          signatureCtx.lineTo(point.x, point.y)
          signatureCtx.stroke()
        })
      })

      if (s.signatureStrokes.length === 0) {
        s.hasSignature = false
        if (placeholder) placeholder.style.display = 'block'
      }
      if (s.isMobile && navigator.vibrate) navigator.vibrate(50)
    }

    // ── salvarNoServidor ──────────────────────────────────────────────

    async function salvarNoServidor() {
      // Robust check: verify canvas has real content
      const imageData = signatureCtx.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height)
      const hasContent = imageData.data.some((channel, index) => {
        return index % 4 !== 3 && channel !== 0
      })

      if (hasContent && !s.hasSignature) {
        s.hasSignature = true
        if (placeholder) placeholder.style.display = 'none'
      }

      if (!s.hasSignature && !hasContent) {
        alert('Por favor, adicione uma assinatura antes de salvar!')
        if (s.isMobile) {
          signatureCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        return
      }

      const nome = (container.querySelector('#nome') || {}).value || ''
      const cargo = (container.querySelector('#cargo') || {}).value || ''
      const empresa = (container.querySelector('#empresa') || {}).value || ''
      const semRegistro = container.querySelector('#semRegistro')
      const tipoRegistroEl = container.querySelector('#tipoRegistro')
      const numRegistroEl = container.querySelector('#numRegistro')
      const estadoRegistroEl = container.querySelector('#estadoRegistro')
      const registro = (container.querySelector('#registro') || {}).value || ''

      // Validate nome
      if (!nome || nome.trim() === '') {
        alert('O campo Nome e obrigatorio!')
        const nomeEl = container.querySelector('#nome')
        if (nomeEl) nomeEl.focus()
        if (s.isMobile && nomeEl) nomeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }

      // Validate registration fields if not "sem registro"
      if (semRegistro && !semRegistro.checked) {
        if (!tipoRegistroEl || !tipoRegistroEl.value || tipoRegistroEl.value === '') {
          alert('O campo Tipo de Registro Profissional e obrigatorio!')
          if (tipoRegistroEl) tipoRegistroEl.focus()
          if (s.isMobile && tipoRegistroEl) tipoRegistroEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
        if (!numRegistroEl || !numRegistroEl.value || numRegistroEl.value.trim() === '') {
          alert('O campo Numero do Registro e obrigatorio!')
          if (numRegistroEl) numRegistroEl.focus()
          if (s.isMobile && numRegistroEl) numRegistroEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
        if (!estadoRegistroEl || !estadoRegistroEl.value || estadoRegistroEl.value === '') {
          alert('O campo Estado (UF) e obrigatorio!')
          if (estadoRegistroEl) estadoRegistroEl.focus()
          if (s.isMobile && estadoRegistroEl) estadoRegistroEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
      }

      // Calculate dimensions
      const largura = calcularLarguraMaxima(nome, cargo, empresa, registro)

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = largura
      tempCanvas.height = 600
      const tempCtx = tempCanvas.getContext('2d')

      let altura = desenharCarimboRetangular(tempCtx, nome, cargo, empresa, registro, false, largura / 2)

      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = largura
      finalCanvas.height = altura
      const finalCtx = finalCanvas.getContext('2d')

      // Re-check content before drawing
      const imageDataCheck = signatureCtx.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height)
      const hasContentCheck = imageDataCheck.data.some((channel, index) => {
        return index % 4 !== 3 && channel !== 0
      })

      if (!hasContentCheck) {
        alert('A assinatura foi perdida! Por favor, adicione uma assinatura novamente antes de salvar.')
        const btnSalvar = container.querySelector('#btnSalvar')
        if (btnSalvar) {
          btnSalvar.disabled = false
          btnSalvar.textContent = 'SALVAR ASSINATURA E ENVIAR'
        }
        return
      }

      desenharCarimboRetangular(finalCtx, nome, cargo, empresa, registro, false, largura / 2)

      const imagemBase64 = finalCanvas.toDataURL('image/png')

      const dados = {
        nome: nome,
        cargo: cargo || '',
        empresa: empresa || '',
        registro: registro || '',
        imagem: imagemBase64
      }

      const btnSalvar = container.querySelector('#btnSalvar')
      let textoOriginal = ''
      if (btnSalvar) {
        textoOriginal = btnSalvar.innerHTML
        btnSalvar.disabled = true
        if (s.isMobile) {
          btnSalvar.innerHTML = '<span class="loading-spinner"></span> Salvando...'
        } else {
          btnSalvar.textContent = 'Salvando...'
        }
      }

      try {
        const response = await fetch('/assinaturas/api/salvar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Erro ao processar resposta do servidor' }))
          throw new Error(errorData.message || `Erro HTTP: ${response.status}`)
        }

        const resultado = await response.json()

        if (resultado.success) {
          if (s.isMobile && navigator.vibrate) navigator.vibrate([100, 50, 100])

          if (s.isMobile) {
            alert('SUCESSO!\n\n' +
              'Assinatura salva!\n\n' +
              resultado.data.arquivo_imagem + '\n' +
              resultado.data.data_hora)
          } else {
            alert('Sucesso!\n\n' +
              'Assinatura salva com sucesso no servidor!\n\n' +
              'Arquivo de imagem: ' + resultado.data.arquivo_imagem + '\n' +
              'Arquivo de dados: ' + resultado.data.arquivo_txt + '\n' +
              'Data/Hora: ' + resultado.data.data_hora + '\n' +
              'Status: ' + resultado.data.status)
          }
        } else {
          throw new Error(resultado.message)
        }
      } catch (error) {
        alert('Erro ao salvar no servidor!\n\n' + error.message)
        console.error('Erro:', error)
      } finally {
        if (btnSalvar) {
          btnSalvar.disabled = false
          btnSalvar.innerHTML = textoOriginal
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // ATTACH EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════

    // AbortController lets us cleanly remove all listeners on cleanup
    const ac = new AbortController()
    const sig = ac.signal

    // ── Canvas drawing listeners ──────────────────────────────────────

    signatureCanvas.style.touchAction = 'none'

    signatureCanvas.addEventListener('mousedown', startDrawing, { passive: false, signal: sig })
    signatureCanvas.addEventListener('mousemove', draw, { passive: false, signal: sig })
    signatureCanvas.addEventListener('mouseup', stopDrawing, { passive: false, signal: sig })
    signatureCanvas.addEventListener('mouseout', stopDrawing, { passive: false, signal: sig })
    signatureCanvas.addEventListener('touchstart', startDrawing, { passive: false, signal: sig })
    signatureCanvas.addEventListener('touchmove', draw, { passive: false, signal: sig })
    signatureCanvas.addEventListener('touchend', stopDrawing, { passive: false, signal: sig })
    signatureCanvas.addEventListener('touchcancel', stopDrawing, { passive: false, signal: sig })

    // ── Color picker ──────────────────────────────────────────────────

    container.querySelectorAll('.color-option').forEach(option => {
      option.addEventListener('click', function () {
        container.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'))
        this.classList.add('active')
        s.currentColor = this.dataset.color
      }, { signal: sig })
    })

    // ── Pen width slider ──────────────────────────────────────────────

    const penWidthInput = container.querySelector('#penWidth')
    if (penWidthInput) {
      penWidthInput.addEventListener('input', function () {
        s.currentWidth = parseInt(this.value)
        const display = container.querySelector('.pen-width-display')
        if (display) display.textContent = s.currentWidth + 'px'
      }, { signal: sig })
    }

    // ── Form field handlers ───────────────────────────────────────────

    const nomeInput = container.querySelector('#nome')
    if (nomeInput) {
      nomeInput.addEventListener('blur', capitalizarNome, { signal: sig })
    }

    const semRegistroCheckbox = container.querySelector('#semRegistro')
    if (semRegistroCheckbox) {
      semRegistroCheckbox.addEventListener('change', toggleRegistro, { signal: sig })
    }

    const tipoRegistroSelect = container.querySelector('#tipoRegistro')
    if (tipoRegistroSelect) {
      tipoRegistroSelect.addEventListener('change', atualizarRegistro, { signal: sig })
    }

    const numRegistroInput = container.querySelector('#numRegistro')
    if (numRegistroInput) {
      numRegistroInput.addEventListener('blur', atualizarRegistro, { signal: sig })
      numRegistroInput.addEventListener('input', atualizarRegistro, { signal: sig })
    }

    const estadoRegistroSelect = container.querySelector('#estadoRegistro')
    if (estadoRegistroSelect) {
      estadoRegistroSelect.addEventListener('change', atualizarRegistro, { signal: sig })
    }

    // ── Button handlers ───────────────────────────────────────────────

    const buttons = container.querySelectorAll('button')
    buttons.forEach(btn => {
      const text = btn.textContent.trim().toLowerCase()
      if (text.includes('limpar')) {
        btn.addEventListener('click', clearSignature, { signal: sig })
      } else if (text.includes('desfazer')) {
        btn.addEventListener('click', undoSignature, { signal: sig })
      } else if (text.includes('atualizar') && text.includes('visualiza')) {
        btn.addEventListener('click', updatePreview, { signal: sig })
      } else if (text.includes('salvar')) {
        btn.addEventListener('click', salvarNoServidor, { signal: sig })
      }
    })

    // ── Auto-update preview on input changes ──────────────────────────

    container.querySelectorAll('input:not(#tipoRegistro):not(#numRegistro):not(#estadoRegistro), select:not(#tipoRegistro):not(#estadoRegistro)').forEach(element => {
      element.addEventListener('input', updatePreview, { signal: sig })
      element.addEventListener('change', updatePreview, { signal: sig })
    })

    // ── Resize protection: save/restore signature canvas on resize ────

    let resizeTimer = null
    const handleResize = () => {
      const ctx = signatureCanvas.getContext('2d')
      if (!ctx) return

      const savedImageData = ctx.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height)
      const savedWidth = signatureCanvas.width
      const savedHeight = signatureCanvas.height

      if (resizeTimer) clearTimeout(resizeTimer)

      resizeTimer = setTimeout(() => {
        if (signatureCanvas.width !== savedWidth || signatureCanvas.height !== savedHeight) {
          const tc = document.createElement('canvas')
          tc.width = savedWidth
          tc.height = savedHeight
          tc.getContext('2d').putImageData(savedImageData, 0, 0)
          ctx.drawImage(tc, 0, 0, savedWidth, savedHeight, 0, 0, signatureCanvas.width, signatureCanvas.height)
        } else {
          ctx.putImageData(savedImageData, 0, 0)
        }
      }, 100)

      // Also re-adjust for mobile on resize
      ajustarCanvasParaMobile()
    }

    window.addEventListener('resize', handleResize, { capture: true, signal: sig })

    // ── Preview canvas setup ──────────────────────────────────────────

    if (previewCanvas) {
      previewCanvas.style.touchAction = 'auto'
      previewCanvas.style.pointerEvents = 'none'
      previewCanvas.setAttribute('width', '400')
      previewCanvas.setAttribute('height', '500')
      previewCanvas.style.maxWidth = '100%'
      previewCanvas.style.height = 'auto'
    }

    // ── Initial preview render ────────────────────────────────────────

    updatePreview()

    // Return cleanup function
    return () => {
      ac.abort()
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [])

  useEffect(() => {
    // Hide spinner after load
    const spinner = document.getElementById('spinner')
    if (spinner) {
      setTimeout(() => {
        spinner.classList.remove('show')
      }, 500)
    }

    const loadContent = async () => {
      try {
        const response = await fetch('/assinaturas/api/conteudo')

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Erro desconhecido')
          if (import.meta.env.DEV) console.error(`Erro HTTP ${response.status}:`, errorText.substring(0, 200))
          throw new Error(`Erro ao carregar conteudo: ${response.status} ${response.statusText}`)
        }

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text()
          if (import.meta.env.DEV) console.error('Resposta nao e JSON:', text.substring(0, 200))
          throw new Error('A API retornou HTML ao inves de JSON. Verifique se o servidor esta rodando na porta 3000.')
        }

        const data = await response.json()

        if (data.success) {
          // Strip inline styles from server HTML (React CSS handles styling)
          let cleanHtml = data.html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

          // Sanitize HTML - no on* handlers needed, we attach listeners programmatically
          setContent(DOMPurify.sanitize(cleanHtml, {
            ADD_TAGS: ['optgroup', 'canvas'],
            ADD_ATTR: ['target', 'rel', 'tabindex', 'data-*'],
            ALLOW_DATA_ATTR: true,
            FORCE_BODY: true,
          }))
          setLoading(false)

          // NOTE: We do NOT inject data.scripts at all.
          // All logic is set up in the second useEffect below after render.

        } else {
          setLoading(false)
          console.error('API retornou sucesso=false:', data.message)
        }
      } catch (error) {
        console.error('Erro ao carregar conteudo:', error)
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  // Second effect: runs after content is rendered into the DOM
  useEffect(() => {
    if (loading || !content) return

    // Small delay to ensure dangerouslySetInnerHTML has flushed to the DOM
    const timer = setTimeout(() => {
      const container = document.querySelector('#carimbo-content')
      if (!container) return

      // Clean up previous listeners if any (e.g. React strict mode double-mount)
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }

      cleanupRef.current = setupAllLogic(container)
    }, 300)

    return () => {
      clearTimeout(timer)
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [loading, content, setupAllLogic])

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
