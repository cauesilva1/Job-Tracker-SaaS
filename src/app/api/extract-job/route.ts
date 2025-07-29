import { NextRequest, NextResponse } from 'next/server';
import { extractJobInfo } from '@/lib/job-scraper';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      );
    }
    
    console.log('API: Extraindo informações da URL:', url);
    
    const jobInfo = await extractJobInfo(url);
    
    console.log('API: Informações extraídas:', jobInfo);
    
    return NextResponse.json(jobInfo);
    
  } catch (error) {
    console.error('API: Erro ao extrair informações:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao extrair informações da vaga',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 