interface JobInfo {
  company?: string;
  position?: string;
  description?: string;
  location?: string;
  salary?: string;
  requirements?: string[];
}

export async function extractJobInfo(url: string): Promise<JobInfo> {
  try {
    // Para LinkedIn
    if (url.includes('linkedin.com/jobs')) {
      return await extractLinkedInJob(url);
    }
    
    // Para Indeed
    if (url.includes('indeed.com')) {
      return await extractIndeedJob(url);
    }
    
    // Para Glassdoor
    if (url.includes('glassdoor.com')) {
      return await extractGlassdoorJob(url);
    }
    
    // Para sites genéricos
    return await extractGenericJob(url);
    
  } catch (error) {
    console.error('Erro ao extrair informações da vaga:', error);
    return {};
  }
}

async function extractLinkedInJob(_url: string): Promise<JobInfo> {
  try {
    // Simulação de extração do LinkedIn
    // Em produção, você usaria uma API ou web scraping
    // const urlParts = _url.split('/');
    // const jobId = urlParts[urlParts.length - 1]; // Para uso futuro
    
    return {
      company: 'Empresa extraída do LinkedIn',
      position: 'Cargo extraído do LinkedIn',
      description: 'Descrição extraída do LinkedIn',
      location: 'Localização extraída do LinkedIn',
    };
  } catch (error) {
    console.error('Erro ao extrair do LinkedIn:', error);
    return {};
  }
}

async function extractIndeedJob(_url: string): Promise<JobInfo> {
  try {
    // Simulação de extração do Indeed
    return {
      company: 'Empresa extraída do Indeed',
      position: 'Cargo extraído do Indeed',
      description: 'Descrição extraída do Indeed',
      location: 'Localização extraída do Indeed',
    };
  } catch (error) {
    console.error('Erro ao extrair do Indeed:', error);
    return {};
  }
}

async function extractGlassdoorJob(_url: string): Promise<JobInfo> {
  try {
    // Simulação de extração do Glassdoor
    return {
      company: 'Empresa extraída do Glassdoor',
      position: 'Cargo extraído do Glassdoor',
      description: 'Descrição extraída do Glassdoor',
      location: 'Localização extraída do Glassdoor',
    };
  } catch (error) {
    console.error('Erro ao extrair do Glassdoor:', error);
    return {};
  }
}

async function extractGenericJob(url: string): Promise<JobInfo> {
  try {
    // Para sites genéricos, tentamos extrair informações básicas da URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    let position = '';
    let company = '';
    
    // Tentativa de extrair informações da URL
    if (pathParts.length > 0) {
      position = pathParts[pathParts.length - 1]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    if (pathParts.length > 1) {
      company = pathParts[pathParts.length - 2]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return {
      company: company || 'Empresa não identificada',
      position: position || 'Cargo não identificado',
      description: 'Descrição não disponível automaticamente',
    };
  } catch (error) {
    console.error('Erro ao extrair informações genéricas:', error);
    return {};
  }
}

// Função para validar se a URL é de uma vaga válida
export function isValidJobUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validDomains = [
      'linkedin.com',
      'indeed.com',
      'glassdoor.com',
      'jobs.google.com',
      'github.com',
      'stackoverflow.com',
      'remoteok.com',
      'weworkremotely.com'
    ];
    
    return validDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
} 