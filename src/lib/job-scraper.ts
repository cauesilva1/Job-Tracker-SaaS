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

async function extractLinkedInJob(url: string): Promise<JobInfo> {
  try {
    console.log('=== LINKEDIN EXTRACTION DEBUG ===');
    console.log('URL:', url);
    
    // Fazer requisição para a página do LinkedIn
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('HTML length:', html.length);
    console.log('First 500 chars of HTML:', html.substring(0, 500));
    
    // Extrair informações usando regex
    const jobInfo: JobInfo = {};
    
    // Extrair título da vaga
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    console.log('Title match:', titleMatch);
    if (titleMatch) {
      let title = titleMatch[1].replace(/\s*\|\s*LinkedIn/, '').trim();
      
      // Limpar o título removendo informações extras
      // Padrão: "Empresa hiring Cargo in Localização"
      const titleCleanup = title.match(/^(.+?)\s+hiring\s+(.+?)\s+in\s+(.+)$/i);
      if (titleCleanup) {
        jobInfo.company = titleCleanup[1].trim();
        jobInfo.position = titleCleanup[2].trim();
        jobInfo.location = titleCleanup[3].trim();
        console.log('Cleaned title - Company:', jobInfo.company);
        console.log('Cleaned title - Position:', jobInfo.position);
        console.log('Cleaned title - Location:', jobInfo.location);
      } else {
        jobInfo.position = title;
        console.log('Extracted title (not cleaned):', title);
      }
    }
    
    // Extrair empresa (procurar por padrões comuns)
    const companyPatterns = [
      /"companyName":"([^"]+)"/,
      /"hiringOrganization":\s*{\s*"name":\s*"([^"]+)"/,
      /<span[^>]*class="[^"]*company[^"]*"[^>]*>([^<]+)<\/span>/i,
      /<div[^>]*class="[^"]*company[^"]*"[^>]*>([^<]+)<\/div>/i,
      /<a[^>]*class="[^"]*company[^"]*"[^>]*>([^<]+)<\/a>/i,
      /<span[^>]*class="[^"]*job-details-jobs-unified-top-card__company-name[^"]*"[^>]*>([^<]+)<\/span>/i
    ];
    
    console.log('Searching for company patterns...');
    for (let i = 0; i < companyPatterns.length; i++) {
      const pattern = companyPatterns[i];
      const match = html.match(pattern);
      console.log(`Company pattern ${i + 1}:`, pattern.source);
      console.log(`Company match ${i + 1}:`, match);
      if (match) {
        jobInfo.company = match[1].trim();
        console.log('Extracted company:', jobInfo.company);
        break;
      }
    }
    
    // Extrair localização
    const locationPatterns = [
      /"jobLocation":\s*{\s*"addressLocality":\s*"([^"]+)"/,
      /<span[^>]*class="[^"]*location[^"]*"[^>]*>([^<]+)<\/span>/i,
      /<div[^>]*class="[^"]*location[^"]*"[^>]*>([^<]+)<\/div>/i
    ];
    
    console.log('Searching for location patterns...');
    for (let i = 0; i < locationPatterns.length; i++) {
      const pattern = locationPatterns[i];
      const match = html.match(pattern);
      console.log(`Location pattern ${i + 1}:`, pattern.source);
      console.log(`Location match ${i + 1}:`, match);
      if (match) {
        jobInfo.location = match[1].trim();
        console.log('Extracted location:', jobInfo.location);
        break;
      }
    }
    
    // Extrair descrição
    const descriptionPatterns = [
      /"description":"([^"]+)"/,
      /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<section[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
      /<div[^>]*class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*show-more-less-html[^"]*"[^>]*>([\s\S]*?)<\/div>/i
    ];
    
    console.log('Searching for description patterns...');
    for (let i = 0; i < descriptionPatterns.length; i++) {
      const pattern = descriptionPatterns[i];
      const match = html.match(pattern);
      console.log(`Description pattern ${i + 1}:`, pattern.source);
      console.log(`Description match ${i + 1}:`, match ? 'Found' : 'Not found');
      if (match) {
        let description = match[1]
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .trim();
        
        // Extrair apenas as seções "Key Responsibilities" e "About You"
        const keyResponsibilitiesMatch = description.match(/Key Responsibilities\s*([\s\S]*?)(?=About You|$)/i);
        const aboutYouMatch = description.match(/About You\s*([\s\S]*?)(?=About the Company|$)/i);
        
        let extractedContent = '';
        
        if (keyResponsibilitiesMatch) {
          extractedContent += 'Key Responsibilities\n' + keyResponsibilitiesMatch[1].trim() + '\n\n';
        }
        
        if (aboutYouMatch) {
          extractedContent += 'About You\n' + aboutYouMatch[1].trim();
        }
        
        // Se não encontrou as seções específicas, usar a descrição completa
        if (!extractedContent.trim()) {
          extractedContent = description;
        }
        
        jobInfo.description = extractedContent.trim();
        console.log('Extracted specific sections:', extractedContent.substring(0, 200));
        break;
      }
    }
    
    // Se não conseguiu extrair informações básicas, usar fallback
    if (!jobInfo.position && !jobInfo.company) {
      console.log('No basic info extracted, using fallback');
      // Tentar extrair da URL
      const urlParts = url.split('/');
      const jobId = urlParts[urlParts.length - 1];
      
      return {
        company: 'Empresa não identificada',
        position: 'Vaga do LinkedIn',
        description: 'Informações não disponíveis automaticamente. Por favor, preencha manualmente.',
        location: 'Localização não identificada'
      };
    }
    
    console.log('=== FINAL EXTRACTED INFO ===');
    console.log('Job Info:', JSON.stringify(jobInfo, null, 2));
    return jobInfo;
    
  } catch (error) {
    console.error('Erro ao extrair do LinkedIn:', error);
    
    // Fallback com informações da URL
    const urlParts = url.split('/');
    const jobId = urlParts[urlParts.length - 1];
    
    return {
      company: 'Empresa não identificada',
      position: 'Vaga do LinkedIn',
      description: 'Não foi possível extrair informações automaticamente. Por favor, preencha manualmente.',
      location: 'Localização não identificada'
    };
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