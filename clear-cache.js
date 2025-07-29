#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Limpando cache e arquivos temporários...');

// Remover pasta .next
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
  console.log('✅ Pasta .next removida');
}

// Remover node_modules (opcional)
const shouldRemoveNodeModules = process.argv.includes('--full');
if (shouldRemoveNodeModules && fs.existsSync('node_modules')) {
  fs.rmSync('node_modules', { recursive: true, force: true });
  console.log('✅ node_modules removida');
}

// Limpar cache do npm
const { execSync } = require('child_process');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache do npm limpo');
} catch (error) {
  console.log('⚠️ Erro ao limpar cache do npm:', error.message);
}

console.log('\n🎯 Próximos passos:');
console.log('1. Execute: npm install (se usou --full)');
console.log('2. Execute: npm run dev');
console.log('3. Abra http://localhost:3000/login');
console.log('4. Teste o Google Sign-In');
console.log('5. Se ainda houver problemas, tente o botão "Google (Alternativo)"');
console.log('6. Ou teste em modo incógnito');

console.log('\n💡 Dicas para resolver o erro PKCE:');
console.log('- Feche todas as abas do localhost:3000');
console.log('- Limpe os cookies do navegador para localhost:3000');
console.log('- Teste em uma janela incógnita');
console.log('- Verifique se não há múltiplas instâncias do servidor rodando'); 