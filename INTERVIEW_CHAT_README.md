# 🤖 Chatbot de Preparação para Entrevistas

## 📋 Estrutura Criada

### **Páginas e Componentes:**
- ✅ `src/app/interview-prep/page.tsx` - Página principal
- ✅ `src/components/chat/InterviewChat.tsx` - Componente principal do chat
- ✅ `src/components/chat/InterviewSettings.tsx` - Configurações da entrevista
- ✅ `src/components/chat/ChatMessage.tsx` - Exibição de mensagens
- ✅ `src/types/interview.ts` - Tipos TypeScript
- ✅ Botão no sidebar - Navegação

## 🎯 Funções para Implementar

### **1. Função: `startNewInterview()`**
**Localização:** `src/components/chat/InterviewChat.tsx` (linha ~40)

**O que fazer:**
- Validar se o cargo foi preenchido
- Criar primeira mensagem da IA com pergunta inicial
- Esconder painel de configurações
- Inicializar estado da entrevista

**Exemplo de implementação:**
```typescript
const startNewInterview = async () => {
  if (!interviewConfig.role.trim()) {
    toast.error('Por favor, informe o cargo');
    return;
  }

  setIsLoading(true);
  
  try {
    // Gerar primeira pergunta baseada no tipo e nível
    const firstQuestion = generateFirstQuestion(interviewConfig);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: firstQuestion,
      timestamp: new Date()
    };

    setMessages([newMessage]);
    setShowSettings(false);
    setInputMessage('');
    
  } catch (error) {
    toast.error('Erro ao iniciar entrevista');
  } finally {
    setIsLoading(false);
  }
};
```

### **2. Função: `sendMessage()`**
**Localização:** `src/components/chat/InterviewChat.tsx` (linha ~50)

**O que fazer:**
- Adicionar mensagem do usuário ao chat
- Chamar API para gerar resposta da IA
- Adicionar resposta da IA ao chat
- Limpar input

**Exemplo de implementação:**
```typescript
const sendMessage = async () => {
  if (!inputMessage.trim()) return;
  
  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: inputMessage,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsLoading(true);

  try {
    // Chamar API para gerar resposta
    const aiResponse = await generateAIResponse(inputMessage, interviewConfig);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse.message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    
  } catch (error) {
    toast.error('Erro ao gerar resposta');
  } finally {
    setIsLoading(false);
  }
};
```

### **3. Função: `generateAIResponse()`**
**Localização:** `src/components/chat/InterviewChat.tsx` (linha ~65)

**O que fazer:**
- Chamar API do OpenRouter com DeepSeek
- Enviar contexto da entrevista
- Gerar resposta contextualizada
- Incluir feedback e próximas perguntas

**Exemplo de implementação:**
```typescript
const generateAIResponse = async (userMessage: string, config: InterviewConfig) => {
  const response = await fetch('/api/interview-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      config: config,
      conversationHistory: messages
    })
  });

  if (!response.ok) {
    throw new Error('Erro na API');
  }

  return await response.json();
};
```

### **4. Função: `resetChat()`**
**Localização:** `src/components/chat/InterviewChat.tsx` (linha ~55)

**O que fazer:**
- Limpar todas as mensagens
- Resetar configurações
- Mostrar painel de configurações
- Limpar input

**Exemplo de implementação:**
```typescript
const resetChat = () => {
  setMessages([]);
  setInputMessage('');
  setShowSettings(true);
  setInterviewConfig({
    type: 'behavioral',
    level: 'mid',
    role: '',
    company: ''
  });
};
```

## 🔧 API Route para Criar

### **Arquivo:** `src/app/api/interview-chat/route.ts`

**O que implementar:**
- Receber mensagem do usuário
- Gerar prompt contextualizado
- Chamar OpenRouter API
- Retornar resposta da IA

**Estrutura sugerida:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { message, config, conversationHistory } = await request.json();
    
    // Gerar prompt baseado no tipo de entrevista
    const prompt = generateInterviewPrompt(message, config, conversationHistory);
    
    // Chamar OpenRouter API
    const aiResponse = await callOpenRouterAPI(prompt);
    
    return NextResponse.json(aiResponse);
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

## 🎨 Melhorias Sugeridas

### **Funcionalidades Extras:**
1. **Feedback em tempo real** - Analisar qualidade das respostas
2. **Sistema de pontuação** - Score da entrevista
3. **Dicas contextuais** - Sugestões baseadas na resposta
4. **Histórico de sessões** - Salvar entrevistas anteriores
5. **Múltiplos cenários** - Diferentes tipos de empresa

### **UX/UI:**
1. **Animações** - Transições suaves
2. **Indicadores visuais** - Progresso da entrevista
3. **Modo escuro** - Tema alternativo
4. **Responsividade** - Melhor experiência mobile

## 🚀 Próximos Passos

1. **Implementar funções básicas** (startNewInterview, sendMessage, resetChat)
2. **Criar API route** (/api/interview-chat)
3. **Testar fluxo completo**
4. **Adicionar funcionalidades extras**
5. **Melhorar UX/UI**

**Boa sorte com a implementação!** 🎯 