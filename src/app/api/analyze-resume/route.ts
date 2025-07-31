import { NextRequest, NextResponse } from 'next/server';

import * as mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { extractJobDescription } from '@/lib/job-scraper';

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando análise de currículo...');
    
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File;
    const jobUrl = formData.get('jobUrl') as string;

    console.log('Arquivo recebido:', resumeFile?.name);
    console.log('URL da vaga:', jobUrl);

    if (!resumeFile || !jobUrl) {
      console.log('Dados obrigatórios não fornecidos');
      return NextResponse.json(
        { error: 'Currículo e URL da vaga são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar tamanho do arquivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (resumeFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo permitido: 10MB' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    console.log('Tipo do arquivo:', resumeFile.type);
    console.log('Nome do arquivo:', resumeFile.name);
    
    // Verificar extensão do arquivo também
    const fileName = resumeFile.name.toLowerCase();
    const isPDF = fileName.endsWith('.pdf') || resumeFile.type === 'application/pdf';
    const isWord = fileName.endsWith('.doc') || fileName.endsWith('.docx') || 
                   resumeFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                   resumeFile.type === 'application/msword';
    
    if (!isPDF && !isWord) {
      console.log('Tipo de arquivo não suportado:', resumeFile.type, 'Nome:', resumeFile.name);
      return NextResponse.json(
        { error: 'Formato de arquivo não suportado. Use PDF (.pdf) ou Word (.doc, .docx).' },
        { status: 400 }
      );
    }

    // Processar arquivo diretamente na memória
    const bytes = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extrair texto do currículo
    console.log('Extraindo texto do currículo...');
    let resumeText = '';
    
    if (isPDF) {
      console.log('Processando PDF...');
      return NextResponse.json(
        { 
          error: 'Processamento de PDF temporariamente indisponível. Por favor, converta seu PDF para Word (.docx) antes de fazer upload. Você pode usar ferramentas online como Google Docs ou Microsoft Word Online para converter.' 
        },
        { status: 400 }
      );
    } else if (isWord) {
      console.log('Processando Word...');
      try {
        const result = await mammoth.extractRawText({ buffer });
        resumeText = result.value;
      } catch (error) {
        console.error('Erro ao processar Word:', error);
        return NextResponse.json(
          { error: 'Erro ao processar arquivo Word. Verifique se o arquivo não está corrompido.' },
          { status: 400 }
        );
      }
    }
    
    if (!resumeText || resumeText.trim().length === 0) {
      console.log('Nenhum texto extraído do arquivo');
      return NextResponse.json(
        { error: 'Não foi possível extrair texto do arquivo. Verifique se o arquivo contém texto.' },
        { status: 400 }
      );
    }
    
    console.log('Texto extraído (primeiros 100 chars):', resumeText.substring(0, 100));

    // Extrair descrição da vaga usando web scraping
    console.log('Extraindo descrição da vaga...');
    const jobDescription = await extractJobDescription(jobUrl);
    console.log('Descrição da vaga (primeiros 100 chars):', jobDescription.substring(0, 100));

    // Analisar com IA
    console.log('Iniciando análise com IA...');
    const analysis = await analyzeWithAI(resumeText, jobDescription);
    console.log('Análise concluída:', analysis);

    // Gerar currículo melhorado
    console.log('Gerando currículo melhorado...');
    const improvedResume = await generateImprovedResume(analysis.improvedResume);
    console.log('Currículo melhorado gerado, tamanho:', improvedResume.length);

    console.log('Retornando resposta...');
    return NextResponse.json({
      success: true,
      analysis: {
        compatibility: analysis.compatibility,
        compatibilityBreakdown: analysis.compatibilityBreakdown || {
          skills: analysis.compatibility,
          experience: analysis.compatibility,
          projects: analysis.compatibility,
          education: analysis.compatibility
        },
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions
      },
      improvedResume: improvedResume.toString('base64')
    });

  } catch (error) {
    console.error('Erro na análise:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}



async function analyzeWithAI(resumeText: string, jobDescription: string) {
  console.log('Iniciando análise com IA...');
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  console.log('Verificando API key...');
  if (!OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY não configurada');
    throw new Error('OPENROUTER_API_KEY não configurada');
  }
  console.log('API key encontrada');

  const prompt = `
Analise o currículo e a descrição da vaga fornecidos e retorne uma análise detalhada e específica em formato JSON com a seguinte estrutura:

{
  "compatibility": 85,
  "compatibilityBreakdown": {
    "skills": 90,
    "experience": 75,
    "projects": 80,
    "education": 85
  },
  "strengths": [
    "Experiência específica em React.js (3 anos) - mencionada na vaga",
    "Habilidades técnicas alinhadas: TypeScript, Node.js",
    "Projetos relevantes: desenvolvimento de aplicações web"
  ],
  "weaknesses": [
    "Falta experiência específica em AWS (requerido na vaga)",
    "Não menciona experiência com Docker (desejável)",
    "Descrição de projetos muito genérica"
  ],
  "suggestions": [
    "Adicionar seção específica de projetos com tecnologias e resultados",
    "Incluir métricas de impacto (ex: 'Reduziu tempo de carregamento em 40%')",
    "Especificar versões de tecnologias e ferramentas usadas",
    "Destacar conquistas e responsabilidades em cada projeto"
  ],
  "improvedResume": "Texto do currículo melhorado com sugestões aplicadas"
}

INSTRUÇÕES DETALHADAS:

1. COMPATIBILIDADE: Calcule baseado em:
   - Habilidades técnicas alinhadas (40% do total)
   - Experiência relevante (30% do total)
   - Projetos similares (20% do total)
   - Formação acadêmica (10% do total)

   COMPATIBILIDADE BREAKDOWN:
   - skills: Porcentagem de habilidades técnicas que aparecem na vaga
   - experience: Relevância da experiência profissional para a posição
   - projects: Alinhamento dos projetos com as responsabilidades da vaga
   - education: Adequação da formação acadêmica para a posição

2. PONTOS FORTES: Liste especificamente:
   - Habilidades que aparecem na vaga
   - Experiência relevante mencionada
   - Projetos que se alinham com a posição
   - Formação acadêmica adequada

3. PONTOS DE MELHORIA: Identifique especificamente:
   - Habilidades requeridas que estão faltando
   - Experiência que poderia ser mais detalhada
   - Projetos que precisam de mais contexto
   - Informações que estão muito genéricas

4. SUGESTÕES: Forneça ações práticas:
   - Como melhorar descrições específicas
   - Que projetos adicionar
   - Como quantificar conquistas
   - Que habilidades desenvolver

CURRÍCULO:
${resumeText}

DESCRIÇÃO DA VAGA:
${jobDescription}

IMPORTANTE: Seja específico e detalhado. Não use frases genéricas como "experiência geral" ou "precisa de mais detalhes". Analise cada ponto e forneça feedback concreto e acionável.
`;

  console.log('Fazendo requisição para OpenRouter...');
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": SITE_URL,
      "X-Title": "Job Tracker SaaS",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "deepseek/deepseek-chat-v3-0324:free",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ]
    })
  });
  console.log('Resposta do OpenRouter:', response.status, response.statusText);

  if (!response.ok) {
    throw new Error(`Erro na API do OpenRouter: ${response.statusText}`);
  }

  const data = await response.json();
  const analysisText = data.choices[0].message.content;
  
  try {
    return JSON.parse(analysisText);
  } catch (error) {
    // Se não conseguir fazer parse do JSON, calcula compatibilidade baseada no conteúdo
    console.log('Erro ao fazer parse do JSON da IA, calculando compatibilidade baseada no conteúdo');
    return calculateCompatibilityFromContent(resumeText, jobDescription);
  }
}

async function generateImprovedResume(improvedText: string): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "CURRÍCULO MELHORADO",
              bold: true,
              size: 24
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: improvedText,
              size: 20
            })
          ]
        })
      ]
    }]
  });

  return await Packer.toBuffer(doc);
}

function calculateCompatibilityFromContent(resumeText: string, jobDescription: string) {
  console.log('Calculando compatibilidade baseada no conteúdo...');
  
  // Normalizar textos para comparação
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Lista de tecnologias e habilidades comuns
  const techSkills = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'python', 'java', 'c#', 'php',
    'html', 'css', 'sass', 'less', 'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'rabbitmq',
    'jenkins', 'github actions', 'gitlab ci', 'jira', 'confluence', 'agile', 'scrum',
    'rest api', 'graphql', 'microservices', 'serverless', 'machine learning', 'ai',
    'data analysis', 'sql', 'nosql', 'linux', 'windows', 'macos'
  ];
  
  // Lista de soft skills
  const softSkills = [
    'liderança', 'comunicação', 'trabalho em equipe', 'resolução de problemas',
    'gestão de projetos', 'análise', 'criatividade', 'adaptabilidade', 'proatividade',
    'leadership', 'communication', 'teamwork', 'problem solving', 'project management',
    'analysis', 'creativity', 'adaptability', 'proactivity'
  ];
  
  // Calcular skills match
  let skillsMatch = 0;
  let totalSkills = 0;
  
  techSkills.forEach(skill => {
    if (jobLower.includes(skill)) {
      totalSkills++;
      if (resumeLower.includes(skill)) {
        skillsMatch++;
      }
    }
  });
  
  const skillsScore = totalSkills > 0 ? (skillsMatch / totalSkills) * 100 : 50;
  
  // Calcular experiência (baseado em anos mencionados)
  const experiencePattern = /(\d+)\s*(anos?|years?)/gi;
  const resumeExperience = [...resumeLower.matchAll(experiencePattern)];
  const jobExperience = [...jobLower.matchAll(experiencePattern)];
  
  let experienceScore = 70; // Default
  if (resumeExperience.length > 0 && jobExperience.length > 0) {
    const resumeYears = Math.max(...resumeExperience.map(m => parseInt(m[1])));
    const jobYears = Math.max(...jobExperience.map(m => parseInt(m[1])));
    
    if (resumeYears >= jobYears) {
      experienceScore = 90;
    } else if (resumeYears >= jobYears * 0.7) {
      experienceScore = 75;
    } else {
      experienceScore = 50;
    }
  }
  
  // Calcular projetos (baseado em palavras-chave de projetos)
  const projectKeywords = ['projeto', 'project', 'desenvolvimento', 'development', 'aplicação', 'application'];
  let projectScore = 60; // Default
  
  const resumeProjectCount = projectKeywords.filter(keyword => resumeLower.includes(keyword)).length;
  const jobProjectCount = projectKeywords.filter(keyword => jobLower.includes(keyword)).length;
  
  if (resumeProjectCount > 0) {
    projectScore = Math.min(90, 60 + (resumeProjectCount * 10));
  }
  
  // Calcular formação (baseado em educação mencionada)
  const educationKeywords = ['graduação', 'graduation', 'bacharel', 'bachelor', 'mestrado', 'master', 'doutorado', 'phd'];
  let educationScore = 70; // Default
  
  const resumeEducation = educationKeywords.filter(keyword => resumeLower.includes(keyword)).length;
  const jobEducation = educationKeywords.filter(keyword => jobLower.includes(keyword)).length;
  
  if (resumeEducation > 0) {
    educationScore = Math.min(90, 70 + (resumeEducation * 10));
  }
  
  // Calcular compatibilidade geral (pesos: skills 40%, experience 30%, projects 20%, education 10%)
  const compatibility = Math.round(
    (skillsScore * 0.4) + (experienceScore * 0.3) + (projectScore * 0.2) + (educationScore * 0.1)
  );
  
  console.log('Scores calculados:', {
    skills: skillsScore,
    experience: experienceScore,
    projects: projectScore,
    education: educationScore,
    compatibility
  });
  
  return {
    compatibility,
    compatibilityBreakdown: {
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      projects: Math.round(projectScore),
      education: Math.round(educationScore)
    },
    strengths: [
      "Análise baseada em conteúdo real do currículo e vaga",
      "Habilidades técnicas identificadas no currículo",
      "Experiência profissional relevante"
    ],
    weaknesses: [
      "Análise automática pode não capturar nuances específicas",
      "Recomenda-se revisão manual para precisão total",
      "Algumas habilidades podem não ter sido detectadas"
    ],
    suggestions: [
      "Revise manualmente a análise para maior precisão",
      "Adicione mais detalhes sobre projetos específicos",
      "Inclua métricas quantificáveis de conquistas",
      "Especifique versões de tecnologias utilizadas"
    ],
    improvedResume: resumeText
  };
} 