'use client';

import { Button } from '@/components/ui/button';
import { Play, Briefcase, Building } from 'lucide-react';

interface InterviewConfig {
  type: 'technical' | 'behavioral' | 'case-study' | 'general';
  level: 'junior' | 'mid' | 'senior';
  role: string;
  company: string;
}

interface InterviewSettingsProps {
  config: InterviewConfig;
  onConfigChange: (config: InterviewConfig) => void;
  onStartInterview: () => void;
}

export default function InterviewSettings({ 
  config, 
  onConfigChange, 
  onStartInterview 
}: InterviewSettingsProps) {
  const interviewTypes = [
    { value: 'behavioral', label: 'Comportamental', description: 'Perguntas sobre experiências passadas' },
    { value: 'technical', label: 'Técnica', description: 'Problemas de código e algoritmos' },
    { value: 'case-study', label: 'Case Study', description: 'Análise de cenários reais' },
    { value: 'general', label: 'Geral', description: 'Mistura de diferentes tipos' }
  ];

  const levels = [
    { value: 'junior', label: 'Júnior', description: '0-2 anos de experiência' },
    { value: 'mid', label: 'Pleno', description: '2-5 anos de experiência' },
    { value: 'senior', label: 'Sênior', description: '5+ anos de experiência' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Entrevista */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Entrevista
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interviewTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onConfigChange({ ...config, type: type.value as 'technical' | 'behavioral' | 'case-study' | 'general' })}
                className={`p-3 text-left rounded-lg border transition-all ${
                  config.type === type.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-gray-600">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Nível */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível da Vaga
          </label>
          <div className="grid grid-cols-3 gap-2">
            {levels.map((level) => (
              <button
                key={level.value}
                onClick={() => onConfigChange({ ...config, level: level.value as 'junior' | 'mid' | 'senior' })}
                className={`p-3 text-center rounded-lg border transition-all ${
                  config.level === level.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{level.label}</div>
                <div className="text-xs text-gray-600">{level.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cargo e Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-1" />
            Cargo
          </label>
          <input
            type="text"
            value={config.role}
            onChange={(e) => onConfigChange({ ...config, role: e.target.value })}
            placeholder="Ex: Desenvolvedor Frontend"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-1" />
            Empresa (opcional)
          </label>
          <input
            type="text"
            value={config.company}
            onChange={(e) => onConfigChange({ ...config, company: e.target.value })}
            placeholder="Ex: Google, Microsoft"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Botão Iniciar */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={onStartInterview}
          disabled={!config.role.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
        >
          <Play className="w-4 h-4 mr-2" />
          Iniciar Entrevista
        </Button>
      </div>
    </div>
  );
} 