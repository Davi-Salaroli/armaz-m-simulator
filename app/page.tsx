"use client"

import { useState } from "react"

const TAXAS: Record<number, number> = {
  2: 0.0573,
  3: 0.0653,
  4: 0.0734,
  5: 0.0817,
  6: 0.0900,
  7: 0.0905,
  8: 0.0991,
  9: 0.1078,
  10: 0.1167,
  11: 0.1257,
  12: 0.1348,
  13: 0.1441,
  14: 0.1535,
  15: 0.1631,
  16: 0.1728,
  17: 0.1827,
  18: 0.1929,
}

function formatCurrency(value: number) {
  return "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function calcularParcela(valorAFinanciar: number, numParcelas: number) {
  const taxa = TAXAS[numParcelas] || 0
  const totalComTaxa = valorAFinanciar * (1 + taxa)
  const parcela = totalComTaxa / numParcelas
  const juros = valorAFinanciar * taxa

  return { parcela, juros, totalComTaxa }
}

export default function Simulador() {
  const [valorBike, setValorBike] = useState("6890")
  const [nomeModelo, setNomeModelo] = useState("V9 MAX")
  const [entrada, setEntrada] = useState("0")
  const [parcelas, setParcelas] = useState<string[]>(["12", "18"])
  const [mensagem, setMensagem] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [resultadosParcelas, setResultadosParcelas] = useState<Array<{ parcelas: number; parcela: number; juros: number }>>([])
  const [saldoAFinanciar, setSaldoAFinanciar] = useState(0)
  const [entradaValor, setEntradaValor] = useState(0)

  const adicionarParcela = () => {
    setParcelas([...parcelas, ""])
  }

  const removerParcela = (index: number) => {
    if (parcelas.length > 1) {
      setParcelas(parcelas.filter((_, i) => i !== index))
    } else {
      alert("Voce precisa ter pelo menos uma opcao de parcelamento!")
    }
  }

  const atualizarParcela = (index: number, value: string) => {
    const novasParcelas = [...parcelas]
    novasParcelas[index] = value
    setParcelas(novasParcelas)
  }

  const gerarSimulacao = () => {
    const valor = parseFloat(valorBike)
    const entradaVal = parseFloat(entrada) || 0
    const parcelasNum = parcelas.map((p) => parseInt(p)).filter((p) => p > 0)

    if (!valor || parcelasNum.length === 0) {
      alert("Preencha o valor da bike e adicione pelo menos uma opcao de parcelamento!")
      return
    }

    const saldo = valor - entradaVal

    if (saldo <= 0) {
      alert("A entrada nao pode ser maior ou igual ao valor da bike!")
      return
    }

    parcelasNum.sort((a, b) => a - b)

    let msg = `🚴 ${nomeModelo || "BIKE"} - Simulacao de Parcelamento\n\nValor: ${formatCurrency(valor)}`

    if (entradaVal > 0) {
      msg += `\nEntrada (PIX): ${formatCurrency(entradaVal)}`
      msg += `\nSaldo a financiar: ${formatCurrency(saldo)}`
    }

    msg += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

    const resultados: Array<{ parcelas: number; parcela: number; juros: number }> = []

    parcelasNum.forEach((p, index) => {
      const result = calcularParcela(saldo, p)
      resultados.push({ parcelas: p, parcela: result.parcela, juros: result.juros })
      msg += `📊 OPCAO ${index + 1}: ${p} PARCELAS\n💰 ${formatCurrency(result.parcela)}/mes\n(Taxa: +${formatCurrency(result.juros)})\n\n`
    })

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nQual parcela se encaixa melhor no seu orcamento? \n\nTemos a ${nomeModelo || "BIKE"} pronta pra voce! 🎯\n\n⚡ Armazem Bikes`

    setMensagem(msg)
    setResultadosParcelas(resultados)
    setSaldoAFinanciar(saldo)
    setEntradaValor(entradaVal)
    setShowResult(true)
  }

  const copiarParaClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mensagem)
      setFeedback("Copiado com sucesso! Cole no WhatsApp agora.")
      setTimeout(() => setFeedback(""), 3000)
    } catch {
      alert("Erro ao copiar. Tente novamente.")
    }
  }

  const copiarComEnumerado = async () => {
    const textoEnumerado = mensagem.replace(/OPCAO (\d+)/g, (_, num) => `${num}.)`)
    try {
      await navigator.clipboard.writeText(textoEnumerado)
      setFeedback("Copiado com numeros! Cole no WhatsApp agora.")
      setTimeout(() => setFeedback(""), 3000)
    } catch {
      alert("Erro ao copiar. Tente novamente.")
    }
  }

  const limparCampos = () => {
    setValorBike("6890")
    setNomeModelo("V9 MAX")
    setEntrada("0")
    setParcelas(["12", "18"])
    setMensagem("")
    setShowResult(false)
    setFeedback("")
  }

  return (
    <div className="min-h-screen p-5 flex items-center justify-center">
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white py-10 px-8 text-center">
          <div className="h-[60px] mb-5 flex items-center justify-center">
            <div className="text-3xl font-bold tracking-tight">
              <span className="text-white">arma</span>
              <span className="text-[#FFD700]">⚡</span>
              <span className="text-white">em</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Simulador de Parcelamento</h1>
          <p className="text-sm text-[#FFD700]">Calcule as parcelas e compartilhe com seus clientes</p>
        </div>

        {/* Content */}
        <div className="p-10">
          <div className="bg-[#f8f9fa] rounded-xl p-8 mb-8 border-2 border-[#FFD700]">
            {/* Valor da bike */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Valor da bike (R$)</label>
              <input
                type="number"
                value={valorBike}
                onChange={(e) => setValorBike(e.target.value)}
                placeholder="Ex: 6890.00"
                step="0.01"
                min="0"
                className="w-full p-3 text-sm border border-[#ddd] rounded-lg text-[#333] focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/10"
              />
            </div>

            {/* Nome do modelo */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Nome do modelo</label>
              <input
                type="text"
                value={nomeModelo}
                onChange={(e) => setNomeModelo(e.target.value)}
                placeholder="Ex: V9 MAX"
                className="w-full p-3 text-sm border border-[#ddd] rounded-lg text-[#333] focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/10"
              />
            </div>

            {/* Entrada */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Entrada em PIX (R$) - deixe 0 se sem entrada
              </label>
              <input
                type="number"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder="Ex: 2500"
                step="100"
                min="0"
                className="w-full p-3 text-sm border border-[#ddd] rounded-lg text-[#333] focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/10"
              />
            </div>

            {/* Parcelas */}
            <div className="bg-white border border-[#ddd] rounded-xl p-5 mb-5">
              <h4 className="text-sm font-semibold text-[#1a1a1a] mb-4">Opcoes de parcelamento</h4>
              <div className="flex flex-col gap-3 mb-4">
                {parcelas.map((parcela, index) => (
                  <div key={index} className="grid grid-cols-[1fr_auto] gap-3 items-end">
                    <input
                      type="number"
                      value={parcela}
                      onChange={(e) => atualizarParcela(index, e.target.value)}
                      placeholder="Ex: 12"
                      min="1"
                      max="24"
                      step="1"
                      className="p-3 text-sm border border-[#ddd] rounded-lg text-[#333] focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/10"
                    />
                    <button
                      type="button"
                      onClick={() => removerParcela(index)}
                      className="px-4 py-2.5 text-xs font-semibold border border-[#ff6b6b] rounded-lg bg-transparent text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white transition-all"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={adicionarParcela}
                className="w-full p-3 text-sm font-semibold border border-[#FFD700] rounded-lg bg-transparent text-[#1a1a1a] hover:bg-[#FFD700] transition-all"
              >
                + Adicionar opcao de parcelamento
              </button>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={gerarSimulacao}
                className="p-3.5 text-sm font-semibold rounded-lg bg-gradient-to-br from-[#FFD700] to-[#FFC700] text-[#1a1a1a] border-2 border-[#FFD700] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FFD700]/30 transition-all"
              >
                Gerar Simulacao
              </button>
              <button
                onClick={limparCampos}
                className="p-3.5 text-sm font-semibold rounded-lg bg-[#f8f9fa] text-[#1a1a1a] border border-[#ddd] hover:bg-[#e9ecef] transition-all"
              >
                Limpar Campos
              </button>
            </div>
          </div>

          {/* Result Section */}
          {showResult && (
            <div className="mt-8">
              <div className="bg-[#f8f9fa] rounded-xl p-5 mb-5 border-2 border-[#FFD700]">
                <div className="bg-white rounded-xl p-5 text-center font-mono whitespace-pre-wrap break-words text-sm leading-7 text-[#333]">
                  {mensagem}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <button
                  onClick={copiarParaClipboard}
                  className="p-3.5 text-sm font-semibold border border-[#FFD700] rounded-lg bg-transparent text-[#1a1a1a] hover:bg-[#FFD700] transition-all"
                >
                  Copiar Mensagem
                </button>
                <button
                  onClick={copiarComEnumerado}
                  className="p-3.5 text-sm font-semibold border border-[#FFD700] rounded-lg bg-transparent text-[#1a1a1a] hover:bg-[#FFD700] transition-all"
                >
                  Copiar com Numeros
                </button>
              </div>

              {feedback && (
                <div className="text-sm text-green-600 font-semibold text-center min-h-[20px] mb-5">{feedback}</div>
              )}

              <div className="bg-[#f8f9fa] rounded-xl p-5 border border-[#ddd]">
                <h4 className="text-sm font-semibold text-[#1a1a1a] mb-4">Resumo comparativo</h4>

                {entradaValor > 0 && (
                  <div className="bg-white border-2 border-[#FFD700] rounded-lg p-4 mb-4 text-sm text-[#666]">
                    <strong>Entrada:</strong> {formatCurrency(entradaValor)} | <strong>Saldo:</strong>{" "}
                    {formatCurrency(saldoAFinanciar)}
                  </div>
                )}

                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                  {resultadosParcelas.map((resultado, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border-2 border-[#FFD700]">
                      <p className="text-xs text-[#666] font-medium">OPCAO {index + 1}</p>
                      <strong className="block text-lg text-[#FFD700] mt-2 font-bold">{resultado.parcelas}x</strong>
                      <strong className="block text-base text-[#FFD700] mt-1">{formatCurrency(resultado.parcela)}</strong>
                      <p className="text-[11px] text-[#999] mt-2">Taxa: +{formatCurrency(resultado.juros)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#f8f9fa] border-t-2 border-[#FFD700] py-5 px-8 text-center text-xs text-[#666]">
          <p>
            Simulador de Parcelamento © 2024 - <strong className="text-[#FFD700]">Armazem</strong> Bikes
          </p>
        </div>
      </div>
    </div>
  )
}
