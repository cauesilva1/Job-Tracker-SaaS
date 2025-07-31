'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Download, Loader2, Brain } from 'lucide-react';
import toast from 'react-hot-toast';

interface AnalysisResult {
  compatibility: number;
  compatibilityBreakdown?: {
    skills: number;
    experience: number;
    projects: number;
    education: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface ResumeAnalysisFormProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export default function ResumeAnalysisForm({ onAnalysisComplete }: ResumeAnalysisFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [improvedResumeBuffer, setImprovedResumeBuffer] = useState<ArrayBuffer | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Formato de arquivo não suportado. Use apenas arquivos Word (.doc, .docx). Para PDF, converta primeiro para Word.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile || !jobUrl) {
      toast.error('Por favor, selecione um arquivo e informe a URL da vaga.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobUrl', jobUrl);

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Erro na análise';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          // Se não conseguir fazer parse do JSON, usar mensagem padrão
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalysisResult(result.analysis);
        // Converter base64 de volta para ArrayBuffer
        const binaryString = atob(result.improvedResume);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        setImprovedResumeBuffer(bytes.buffer);
        onAnalysisComplete?.(result.analysis);
        toast.success('Análise concluída com sucesso!');
      } else {
        throw new Error('Erro na análise');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error(error instanceof Error ? error.message : 'Erro na análise');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImprovedResume = () => {
    if (!improvedResumeBuffer) return;

    const blob = new Blob([improvedResumeBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'curriculo-melhorado.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Upload do Currículo
          </h2>
          <p className="text-sm text-gray-600">
            Faça upload e análise
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload do Currículo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seu Currículo (Word)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">
                {selectedFile ? selectedFile.name : 'Clique para selecionar arquivo'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Word (.doc, .docx) - Para PDF, converta primeiro para Word
              </p>
            </label>
          </div>
          
          {/* Ajuda para conversão de PDF */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">📄</span>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium mb-1">
                  Tem um arquivo PDF?
                </p>
                <p className="text-sm text-blue-600">
                  Converta para Word usando: Google Docs, Microsoft Word Online, ou qualquer conversor online.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* URL da Vaga */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL da Vaga
          </label>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://linkedin.com/jobs/view/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Botão de Análise */}
        <Button
          type="submit"
          disabled={isLoading || !selectedFile || !jobUrl}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Analisar Currículo
            </>
          )}
        </Button>
      </form>

      {/* Resultados da Análise */}
      {analysisResult && (
        <div className="mt-8 space-y-6 max-h-[calc(100vh-400px)] overflow-y-auto">
          <div className="border-t pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Resultados da Análise
                </h3>
                <p className="text-sm text-gray-600">
                  Análise completa com IA
                </p>
              </div>
            </div>

            {/* Compatibilidade */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Compatibilidade com a Vaga
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {analysisResult.compatibility}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisResult.compatibility}%` }}
                ></div>
              </div>
              
              {/* Breakdown da Compatibilidade */}
              {analysisResult.compatibilityBreakdown && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Detalhamento da Compatibilidade
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Habilidades</span>
                        <span>{analysisResult.compatibilityBreakdown.skills}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: `${analysisResult.compatibilityBreakdown.skills}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Experiência</span>
                        <span>{analysisResult.compatibilityBreakdown.experience}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${analysisResult.compatibilityBreakdown.experience}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Projetos</span>
                        <span>{analysisResult.compatibilityBreakdown.projects}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-purple-500 h-1 rounded-full"
                          style={{ width: `${analysisResult.compatibilityBreakdown.projects}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Formação</span>
                        <span>{analysisResult.compatibilityBreakdown.education}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-orange-500 h-1 rounded-full"
                          style={{ width: `${analysisResult.compatibilityBreakdown.education}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pontos Fortes */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                <span className="mr-1">✅</span>
                Pontos Fortes
              </h4>
              <ul className="space-y-2">
                {analysisResult.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>{strength}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pontos de Melhoria */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                <span className="mr-1">⚠️</span>
                Pontos de Melhoria
              </h4>
              <ul className="space-y-2">
                {analysisResult.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>{weakness}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sugestões */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                <span className="mr-1">💡</span>
                Sugestões de Melhoria
              </h4>
              <ul className="space-y-2">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>{suggestion}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download do Currículo Melhorado */}
            {improvedResumeBuffer && (
              <Button
                onClick={downloadImprovedResume}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Currículo Melhorado
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 