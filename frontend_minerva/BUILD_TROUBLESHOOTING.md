# Troubleshooting - Problemas de Build Next.js

## 🚨 Erros Comuns e Soluções

### 1. Erro ENOENT: no such file or directory (_buildManifest.js)

**Sintomas:**
```
Error: ENOENT: no such file or directory, open '...\\_buildManifest.js.tmp.xxx'
```

**Soluções:**
```bash
# Opção 1: Limpeza manual
npm run clean
npm install
npm run dev

# Opção 2: Usar o script de correção
node fix-build-errors.js
npm install
npm run dev

# Opção 3: Limpeza completa (Windows)
cleanup-next.bat
```

### 2. Erro EPERM: operation not permitted (trace file)

**Sintomas:**
```
Error: EPERM: operation not permitted, open '...\\.next\\trace'
```

**Solução:**
Este é um erro conhecido no Windows. O projeto continua funcionando normalmente. Para evitar:

1. Execute o Visual Studio Code/Terminal como Administrador
2. Ou adicione exclusão no antivírus para a pasta do projeto
3. Ou use WSL (Windows Subsystem for Linux)

### 3. Port 3000 is in use

**Sintomas:**
```
⚠ Port 3000 is in use, using available port 3001 instead.
```

**Soluções:**
```bash
# Encontrar processo usando porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F

# Ou usar porta diferente
npm run dev -- -p 3001
```

### 4. Problemas de Cache

**Sintomas:**
- Build lento
- Mudanças não aparecem
- Erros de módulos não encontrados

**Soluções:**
```bash
# Limpar cache npm
npm cache clean --force

# Limpar cache Next.js
rm -rf .next

# Reinstalar dependências
rm -rf node_modules
npm install

# Usar o script de limpeza completa
npm run clean
```

### 5. Problemas de TypeScript

**Sintomas:**
- Erros de tipo não reconhecido
- Módulos não encontrados

**Soluções:**
```bash
# Verificar dependências TypeScript
npm install --save-dev typescript @types/react @types/node

# Regenerar tipos
npx tsc --build --clean
npx tsc --build
```

## 🛠️ Scripts Úteis

### Scripts no package.json:
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "rimraf .next && npm cache clean --force"
  }
}
```

### Scripts de manutenção:

#### cleanup-next.bat (Windows):
```batch
@echo off
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
rmdir /s /q .next >nul 2>&1
rmdir /s /q node_modules >nul 2>&1
npm cache clean --force
npm install
```

#### fix-build-errors.js:
```bash
node fix-build-errors.js
```

## 📋 Checklist de Resolução

1. ✅ Parar todos os processos Node.js
2. ✅ Remover pasta `.next`
3. ✅ Limpar cache npm
4. ✅ Verificar `next.config.mjs`
5. ✅ Reinstalar dependências
6. ✅ Executar `npm run dev`

## 🚀 Configuração Recomendada (Windows)

### next.config.mjs:
```javascript
const nextConfig = {
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
    },
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
    }
    return config
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

### .gitignore essencial:
```
node_modules/
.next/
.env*
*.log
.DS_Store
```

## 🆘 Se Nada Funcionar

1. **Backup do código**
2. **Clone fresh do repositório**
3. **Copiar apenas arquivos de código (não node_modules/.next)**
4. **npm install**
5. **npm run dev**

## 📞 Suporte

- Documentação Next.js: https://nextjs.org/docs
- Issues conhecidas: https://github.com/vercel/next.js/issues
- Stack Overflow: https://stackoverflow.com/questions/tagged/next.js