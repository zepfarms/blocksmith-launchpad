import { SignatureData, SignatureStyle } from "@/pages/dashboard/EmailSignatureGenerator";

const getSocialIconUrl = (platform: string, style: 'color' | 'grayscale' | 'outlined'): string => {
  const icons: Record<string, string> = {
    linkedin: style === 'grayscale' ? '666666' : '0A66C2',
    twitter: style === 'grayscale' ? '666666' : '000000',
    facebook: style === 'grayscale' ? '666666' : '1877F2',
    instagram: style === 'grayscale' ? '666666' : 'E4405F',
    github: style === 'grayscale' ? '666666' : '181717',
    youtube: style === 'grayscale' ? '666666' : 'FF0000',
  };

  return `https://cdn.simpleicons.org/${platform}/${icons[platform]}`;
};

const getFontSize = (size: 'small' | 'medium' | 'large'): { base: number; name: number; title: number } => {
  const sizes = {
    small: { base: 12, name: 16, title: 13 },
    medium: { base: 14, name: 18, title: 14 },
    large: { base: 16, name: 20, title: 16 },
  };
  return sizes[size];
};

const generateSocialIcons = (data: SignatureData, style: SignatureStyle): string => {
  if (!style.includeSocial) return '';

  const socialLinks = [
    { url: data.linkedin, platform: 'linkedin' },
    { url: data.twitter, platform: 'twitter' },
    { url: data.facebook, platform: 'facebook' },
    { url: data.instagram, platform: 'instagram' },
    { url: data.github, platform: 'github' },
    { url: data.youtube, platform: 'youtube' },
  ].filter(link => link.url);

  if (socialLinks.length === 0) return '';

  return `
    <tr>
      <td colspan="2" style="padding-top: 15px;">
        ${socialLinks.map(link => `
          <a href="${link.url}" style="text-decoration: none; margin-right: 10px;">
            <img src="${getSocialIconUrl(link.platform, style.iconStyle)}" width="24" height="24" alt="${link.platform}" style="display: inline-block; vertical-align: middle;" />
          </a>
        `).join('')}
      </td>
    </tr>
  `;
};

const generateClassicTemplate = (data: SignatureData, style: SignatureStyle): string => {
  const fontSize = getFontSize(style.fontSize);
  
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: ${style.fontFamily}, sans-serif; font-size: ${fontSize.base}px; color: ${style.secondaryColor}; max-width: 600px;">
      <tr>
        ${style.includePhoto && data.photoUrl ? `
          <td style="padding-right: 15px; vertical-align: top;">
            <img src="${data.photoUrl}" width="80" height="80" style="border-radius: 50%; display: block;" alt="${data.fullName}" />
          </td>
        ` : ''}
        <td style="vertical-align: top;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size: ${fontSize.name}px; font-weight: bold; color: ${style.primaryColor}; padding-bottom: 4px;">${data.fullName}</td>
            </tr>
            <tr>
              <td style="font-size: ${fontSize.title}px; color: ${style.secondaryColor}; padding-bottom: 2px;">${data.jobTitle}</td>
            </tr>
            <tr>
              <td style="font-size: ${fontSize.title}px; color: ${style.secondaryColor}; padding-bottom: 10px;">${data.company}${data.department ? ` | ${data.department}` : ''}</td>
            </tr>
            ${data.email ? `
              <tr>
                <td style="padding-top: 4px;">
                  <a href="mailto:${data.email}" style="color: #0066cc; text-decoration: none;">📧 ${data.email}</a>
                </td>
              </tr>
            ` : ''}
            ${data.phone ? `
              <tr>
                <td style="padding-top: 4px; color: ${style.secondaryColor};">📱 ${data.phone}</td>
              </tr>
            ` : ''}
            ${data.website ? `
              <tr>
                <td style="padding-top: 4px;">
                  <a href="${data.website}" style="color: #0066cc; text-decoration: none;">🌐 ${data.website.replace(/^https?:\/\//, '')}</a>
                </td>
              </tr>
            ` : ''}
            ${data.address ? `
              <tr>
                <td style="padding-top: 4px; color: ${style.secondaryColor};">📍 ${data.address}</td>
              </tr>
            ` : ''}
          </table>
        </td>
      </tr>
      ${generateSocialIcons(data, style)}
      ${style.includeLogo && data.logoUrl ? `
        <tr>
          <td colspan="2" style="padding-top: 15px; border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 15px;">
            <img src="${data.logoUrl}" height="40" alt="${data.company}" style="display: block;" />
          </td>
        </tr>
      ` : ''}
      ${data.tagline ? `
        <tr>
          <td colspan="2" style="padding-top: 10px; font-style: italic; color: ${style.secondaryColor}; font-size: ${fontSize.base - 1}px;">"${data.tagline}"</td>
        </tr>
      ` : ''}
      ${data.disclaimer ? `
        <tr>
          <td colspan="2" style="padding-top: 15px; font-size: ${fontSize.base - 2}px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 10px; margin-top: 10px;">${data.disclaimer}</td>
        </tr>
      ` : ''}
    </table>
  `;
};

const generateModernTemplate = (data: SignatureData, style: SignatureStyle): string => {
  const fontSize = getFontSize(style.fontSize);
  
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: ${style.fontFamily}, sans-serif; font-size: ${fontSize.base}px; color: ${style.secondaryColor}; max-width: 600px;">
      <tr>
        <td>
          <div style="font-size: ${fontSize.name}px; font-weight: bold; color: ${style.primaryColor}; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 4px;">${data.fullName}</div>
          <div style="font-size: ${fontSize.title}px; color: ${style.secondaryColor}; margin-bottom: 15px;">${data.jobTitle} | ${data.company}</div>
          
          ${data.email ? `<div style="margin-bottom: 4px;">E: <a href="mailto:${data.email}" style="color: #0066cc; text-decoration: none;">${data.email}</a></div>` : ''}
          ${data.phone ? `<div style="margin-bottom: 4px;">M: ${data.phone}</div>` : ''}
          ${data.website ? `<div style="margin-bottom: 4px;">W: <a href="${data.website}" style="color: #0066cc; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a></div>` : ''}
          
          ${style.includeSocial ? `
            <div style="margin-top: 15px;">
              ${[
                { url: data.linkedin, platform: 'linkedin' },
                { url: data.twitter, platform: 'twitter' },
                { url: data.facebook, platform: 'facebook' },
              ].filter(link => link.url).map(link => `
                <a href="${link.url}" style="text-decoration: none; margin-right: 10px;">
                  <img src="${getSocialIconUrl(link.platform, style.iconStyle)}" width="24" height="24" alt="${link.platform}" style="display: inline-block; vertical-align: middle;" />
                </a>
              `).join('')}
            </div>
          ` : ''}
          
          ${data.tagline ? `
            <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid ${style.primaryColor}; font-size: ${fontSize.base - 1}px; color: ${style.secondaryColor};">${data.tagline}</div>
          ` : ''}
        </td>
      </tr>
    </table>
  `;
};

const generateCreativeTemplate = (data: SignatureData, style: SignatureStyle): string => {
  const fontSize = getFontSize(style.fontSize);
  
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: ${style.fontFamily}, sans-serif; font-size: ${fontSize.base}px; color: ${style.secondaryColor}; max-width: 600px; border: 2px solid #e0e0e0; border-radius: 10px; padding: 20px;">
      <tr>
        ${style.includePhoto && data.photoUrl ? `
          <td style="padding-right: 20px; vertical-align: top;">
            <div style="width: 100px; height: 100px; border-radius: 10px; overflow: hidden; border: 3px solid ${style.primaryColor};">
              <img src="${data.photoUrl}" width="100" height="100" style="display: block; object-fit: cover;" alt="${data.fullName}" />
            </div>
          </td>
        ` : ''}
        <td style="vertical-align: top;">
          <div style="font-size: ${fontSize.name}px; font-weight: bold; color: ${style.primaryColor}; margin-bottom: 2px;">${data.fullName}</div>
          <div style="font-size: ${fontSize.title}px; color: ${style.secondaryColor}; margin-bottom: 12px;">${data.jobTitle}</div>
          
          ${data.email ? `<div style="margin-bottom: 4px;">📧 <a href="mailto:${data.email}" style="color: #0066cc; text-decoration: none;">${data.email}</a></div>` : ''}
          ${data.phone ? `<div style="margin-bottom: 4px;">📱 ${data.phone}</div>` : ''}
          ${data.website ? `<div style="margin-bottom: 4px;">🌐 <a href="${data.website}" style="color: #0066cc; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a></div>` : ''}
          
          ${style.includeSocial ? `
            <div style="margin-top: 12px;">
              ${[
                { url: data.linkedin, platform: 'linkedin' },
                { url: data.twitter, platform: 'twitter' },
                { url: data.instagram, platform: 'instagram' },
              ].filter(link => link.url).map(link => `
                <a href="${link.url}" style="text-decoration: none; margin-right: 8px;">
                  <img src="${getSocialIconUrl(link.platform, style.iconStyle)}" width="22" height="22" alt="${link.platform}" style="display: inline-block; vertical-align: middle;" />
                </a>
              `).join('')}
            </div>
          ` : ''}
        </td>
      </tr>
      ${data.bannerUrl ? `
        <tr>
          <td colspan="2" style="padding-top: 20px;">
            <img src="${data.bannerUrl}" style="width: 100%; max-width: 560px; height: auto; border-radius: 5px; display: block;" alt="Banner" />
          </td>
        </tr>
      ` : ''}
    </table>
  `;
};

const generateCompactTemplate = (data: SignatureData, style: SignatureStyle): string => {
  const fontSize = getFontSize(style.fontSize);
  
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: ${style.fontFamily}, sans-serif; font-size: ${fontSize.base}px; color: ${style.secondaryColor}; max-width: 600px;">
      <tr>
        <td>
          <span style="font-weight: bold; color: ${style.primaryColor};">${data.fullName}</span> | 
          <span>${data.jobTitle}</span> | 
          <span>${data.company}</span>
          <br/>
          ${data.email ? `📧 <a href="mailto:${data.email}" style="color: #0066cc; text-decoration: none;">${data.email}</a>` : ''} 
          ${data.phone ? `| 📱 ${data.phone}` : ''} 
          ${data.website ? `| 🌐 <a href="${data.website}" style="color: #0066cc; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a>` : ''}
          ${style.includeSocial ? `
            <br/>
            ${[
              { url: data.linkedin, platform: 'linkedin' },
              { url: data.twitter, platform: 'twitter' },
              { url: data.facebook, platform: 'facebook' },
            ].filter(link => link.url).map(link => `
              <a href="${link.url}" style="text-decoration: none; margin-right: 8px;">
                <img src="${getSocialIconUrl(link.platform, style.iconStyle)}" width="18" height="18" alt="${link.platform}" style="display: inline-block; vertical-align: middle;" />
              </a>
            `).join('')}
          ` : ''}
        </td>
      </tr>
    </table>
  `;
};

const generateBannerTemplate = (data: SignatureData, style: SignatureStyle): string => {
  const fontSize = getFontSize(style.fontSize);
  
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: ${style.fontFamily}, sans-serif; font-size: ${fontSize.base}px; color: ${style.secondaryColor}; max-width: 600px;">
      ${data.bannerUrl ? `
        <tr>
          <td style="padding-bottom: 20px;">
            <div style="width: 100%; max-width: 600px; height: 120px; background: linear-gradient(135deg, ${style.primaryColor}, ${style.secondaryColor}); border-radius: 10px; overflow: hidden; position: relative;">
              <img src="${data.bannerUrl}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.3;" alt="Banner" />
              ${style.includeLogo && data.logoUrl ? `
                <div style="position: absolute; top: 50%; left: 20px; transform: translateY(-50%);">
                  <img src="${data.logoUrl}" height="60" alt="${data.company}" />
                </div>
              ` : ''}
            </div>
          </td>
        </tr>
      ` : ''}
      <tr>
        ${style.includePhoto && data.photoUrl ? `
          <td style="padding-right: 15px; vertical-align: top;">
            <img src="${data.photoUrl}" width="80" height="80" style="border-radius: 50%; display: block; border: 3px solid ${style.primaryColor};" alt="${data.fullName}" />
          </td>
        ` : ''}
        <td style="vertical-align: top;">
          <div style="font-size: ${fontSize.name}px; font-weight: bold; color: ${style.primaryColor}; margin-bottom: 4px;">${data.fullName}</div>
          <div style="font-size: ${fontSize.title}px; color: ${style.secondaryColor}; margin-bottom: 12px;">${data.jobTitle}, ${data.company}</div>
          
          ${data.email ? `<div style="margin-bottom: 4px;">📧 <a href="mailto:${data.email}" style="color: #0066cc; text-decoration: none;">${data.email}</a></div>` : ''}
          ${data.phone ? `<div style="margin-bottom: 4px;">📱 ${data.phone}</div>` : ''}
          ${data.website ? `<div style="margin-bottom: 4px;">🌐 <a href="${data.website}" style="color: #0066cc; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a></div>` : ''}
          
          ${style.includeSocial ? `
            <div style="margin-top: 12px;">
              ${[
                { url: data.linkedin, platform: 'linkedin' },
                { url: data.twitter, platform: 'twitter' },
                { url: data.facebook, platform: 'facebook' },
                { url: data.instagram, platform: 'instagram' },
              ].filter(link => link.url).map(link => `
                <a href="${link.url}" style="text-decoration: none; margin-right: 10px;">
                  <img src="${getSocialIconUrl(link.platform, style.iconStyle)}" width="24" height="24" alt="${link.platform}" style="display: inline-block; vertical-align: middle;" />
                </a>
              `).join('')}
            </div>
          ` : ''}
          
          ${data.tagline ? `
            <div style="margin-top: 12px; font-style: italic; color: ${style.secondaryColor}; font-size: ${fontSize.base - 1}px;">"${data.tagline}"</div>
          ` : ''}
        </td>
      </tr>
    </table>
  `;
};

export const generateSignatureHTML = (data: SignatureData, style: SignatureStyle): string => {
  switch (style.template) {
    case 'classic':
      return generateClassicTemplate(data, style);
    case 'modern':
      return generateModernTemplate(data, style);
    case 'creative':
      return generateCreativeTemplate(data, style);
    case 'compact':
      return generateCompactTemplate(data, style);
    case 'banner':
      return generateBannerTemplate(data, style);
    default:
      return generateClassicTemplate(data, style);
  }
};