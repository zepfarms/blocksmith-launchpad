interface TemplateContent {
  businessName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  services: Array<{ name: string; description: string }>;
  phone: string;
  email: string;
  address: string;
  logoUrl?: string;
}

export async function renderTemplate(
  templateId: string,
  content: TemplateContent
): Promise<string> {
  try {
    // Fetch template HTML
    const htmlResponse = await fetch(`/templates/${templateId}/index.html`);
    if (!htmlResponse.ok) throw new Error(`Template ${templateId} not found`);
    let html = await htmlResponse.text();

    // Replace basic variables
    html = html
      .replace(/\{\{BUSINESS_NAME\}\}/g, content.businessName)
      .replace(/\{\{HERO_TITLE\}\}/g, content.heroTitle)
      .replace(/\{\{HERO_SUBTITLE\}\}/g, content.heroSubtitle)
      .replace(/\{\{ABOUT_TEXT\}\}/g, content.aboutText)
      .replace(/\{\{PHONE\}\}/g, content.phone)
      .replace(/\{\{EMAIL\}\}/g, content.email)
      .replace(/\{\{ADDRESS\}\}/g, content.address)
      .replace(/\{\{LOGO_URL\}\}/g, content.logoUrl || '/acari-logo.png');

    // Handle services loop
    const servicesHtml = content.services.map(service => `
      <div class="service-card">
        <h3>${escapeHtml(service.name)}</h3>
        <p>${escapeHtml(service.description)}</p>
      </div>
    `).join('');
    
    html = html.replace(/\{\{SERVICES_LOOP\}\}/g, servicesHtml);

    // Fetch and inline CSS
    const cssResponse = await fetch(`/templates/${templateId}/styles.css`);
    if (cssResponse.ok) {
      const css = await cssResponse.text();
      html = html.replace('</head>', `<style>${css}</style></head>`);
    }

    // Fetch and inline JavaScript
    const jsResponse = await fetch(`/templates/${templateId}/script.js`);
    if (jsResponse.ok) {
      const js = await jsResponse.text();
      html = html.replace('</body>', `<script>${js}</script></body>`);
    }

    return html;
  } catch (error) {
    console.error('Error rendering template:', error);
    throw error;
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}