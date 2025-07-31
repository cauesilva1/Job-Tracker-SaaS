# Análise de Currículo com IA

Esta funcionalidade permite que usuários façam upload de seus currículos (PDF ou Word) e analisem a compatibilidade com vagas específicas usando IA.

## Funcionalidades

- ✅ Upload de currículos em PDF e Word
- ✅ Extração automática da descrição da vaga via web scraping
- ✅ Análise de compatibilidade com IA (DeepSeek)
- ✅ Relatório detalhado com pontos fortes e fracos
- ✅ Sugestões de melhorias
- ✅ Geração de currículo melhorado em formato .docx

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` com:

```env
# OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site URL for OpenRouter
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Obter API Key do OpenRouter

1. Acesse [OpenRouter](https://openrouter.ai/)
2. Crie uma conta e obtenha sua API key
3. Adicione a key no arquivo `.env.local`

## Como usar

1. Acesse `/analyze-resume` no seu projeto
2. Faça upload do seu currículo (PDF ou Word)
3. Cole a URL da vaga (LinkedIn, Indeed, Glassdoor, etc.)
4. Clique em "Analisar Currículo"
5. Aguarde a análise da IA
6. Veja os resultados e baixe o currículo melhorado

## Estrutura do código

### API Route
- `src/app/api/analyze-resume/route.ts` - Endpoint principal para análise

### Componentes
- `src/components/forms/ResumeAnalysisForm.tsx` - Formulário de upload e análise

### Utilitários
- `src/lib/job-scraper.ts` - Web scraping de descrições de vagas

### Páginas
- `src/app/analyze-resume/page.tsx` - Página de análise

## Sites suportados para web scraping

- LinkedIn
- Indeed
- Glassdoor
- Sites genéricos (fallback)

## Tecnologias utilizadas

- **Next.js 15** - Framework React
- **pdf-parse** - Extração de texto de PDFs
- **mammoth** - Extração de texto de arquivos Word
- **docx** - Geração de arquivos Word
- **jsdom** - Web scraping
- **DeepSeek AI** - Análise de compatibilidade via OpenRouter

## Deploy na Vercel

### Configuração necessária

1. **Variáveis de ambiente na Vercel:**
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

2. **Configurações do projeto:**
   - O projeto está configurado para funcionar na Vercel
   - Arquivos temporários são processados em memória
   - Timeout configurado para 60 segundos

### Comandos de deploy

```bash
# Build local para teste
npm run build

# Deploy na Vercel
vercel --prod
```

## Próximos passos

- [ ] Implementar cache de análises
- [ ] Adicionar mais sites para web scraping
- [ ] Melhorar a formatação do currículo gerado
- [ ] Adicionar histórico de análises
- [ ] Implementar análise de múltiplas vagas

## Troubleshooting

### Erro de API Key
Certifique-se de que a `OPENROUTER_API_KEY` está configurada corretamente.

### Erro de upload de arquivo
Verifique se o arquivo é PDF ou Word (.doc, .docx).

### Erro de web scraping
Alguns sites podem bloquear requisições. A funcionalidade tem fallback para extração genérica.

## Contribuindo

Para adicionar suporte a novos sites de vagas, edite `src/lib/job-scraper.ts` e adicione novos seletores CSS. 