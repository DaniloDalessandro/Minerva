"use client"

export default function AlicePageUltraSimple() {
  console.log("🔍 Alice Ultra Simple - Componente renderizado")
  
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "blue" }}>🚀 Alice Ultra Simple Test</h1>
      <p>Se você está vendo esta mensagem, o problema NÃO é:</p>
      <ul>
        <li>❌ Problema no Next.js</li>
        <li>❌ Problema no roteamento</li>
        <li>❌ Problema no React</li>
        <li>❌ Problema no layout</li>
      </ul>
      <p style={{ color: "green", fontWeight: "bold" }}>
        ✅ O problema está nas importações complexas ou componentes UI!
      </p>
    </div>
  )
}