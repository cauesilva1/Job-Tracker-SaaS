'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Settings, Play, RotateCcw, MessageCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import InterviewSettings from './InterviewSettings';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface InterviewConfig {
  type: 'technical' | 'behavioral' | 'case-study' | 'general';
  level: 'junior' | 'mid' | 'senior';
  role: string;
  company: string;
}

interface InterviewChatProps {
  userId: string;
}

export default function InterviewChat({ userId }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({
    type: 'behavioral',
    level: 'mid',
    role: '',
    company: ''
  });

  // TODO: Implementar função para iniciar nova entrevista
  const startNewInterview = async () => {
    // Implementar lógica aqui
    console.log('Iniciando nova entrevista:', interviewConfig);
  };

  // TODO: Implementar função para enviar mensagem
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Implementar lógica aqui
    console.log('Enviando mensagem:', inputMessage);
  };

  // TODO: Implementar função para resetar chat
  const resetChat = () => {
    // Implementar lógica aqui
    console.log('Resetando chat');
  };

  // TODO: Implementar função para gerar resposta da IA
  const generateAIResponse = async (userMessage: string) => {
    // Implementar lógica aqui
    console.log('Gerando resposta da IA para:', userMessage);
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Entrevista Simulada</h3>
            <p className="text-sm text-gray-600">
              {interviewConfig.type === 'technical' && 'Entrevista Técnica'}
              {interviewConfig.type === 'behavioral' && 'Entrevista Comportamental'}
              {interviewConfig.type === 'case-study' && 'Case Study'}
              {interviewConfig.type === 'general' && 'Entrevista Geral'}
              {' • '}
              {interviewConfig.level === 'junior' && 'Júnior'}
              {interviewConfig.level === 'mid' && 'Pleno'}
              {interviewConfig.level === 'senior' && 'Sênior'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
          
          <Button
            onClick={resetChat}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <InterviewSettings
            config={interviewConfig}
            onConfigChange={setInterviewConfig}
            onStartInterview={startNewInterview}
          />
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Pronto para começar?
            </h3>
            <p className="text-gray-600 mb-4">
              Configure a entrevista acima e clique em &quot;Iniciar Entrevista&quot;
            </p>
            <Button
              onClick={startNewInterview}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Entrevista
            </Button>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-sm">IA está digitando...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua resposta..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 