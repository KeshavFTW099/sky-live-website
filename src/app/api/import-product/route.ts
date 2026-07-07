import { NextResponse } from 'next/server';
import { ImportProductSchema } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate the import URL using Zod
    const validationResult = ImportProductSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const targetUrl = validationResult.data.url;

    // 2. Fetch the external webpage HTML
    const pageRes = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });

    if (!pageRes.ok) {
      return NextResponse.json(
        { error: `Could not fetch URL: HTTP ${pageRes.status}` },
        { status: 502 }
      );
    }

    const html = await pageRes.text();
    const origin = new URL(targetUrl).origin;

    // ── Scraping Helpers ──────────────────────────────────────────────────
    const getMeta = (property: string) => {
      const m =
        html.match(
          new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i')
        ) ||
        html.match(
          new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`, 'i')
        );
      return m ? m[1].trim() : '';
    };

    const stripTags = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    const decodeHtml = (s: string) =>
      s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)));

    // ── 1. JSON-LD Structured Data ────────────────────────────────
    let jsonLd: any = null;
    const jsonLdMatches = [
      ...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    ];
    for (const m of jsonLdMatches) {
      try {
        const parsed = JSON.parse(m[1]);
        const item = Array.isArray(parsed) ? parsed[0] : parsed;
        if (item['@type'] && (item['@type'].toLowerCase().includes('product') || item.name)) {
          jsonLd = item;
          break;
        }
      } catch {
        /* ignore parse errors */
      }
    }

    // ── 2. OpenGraph / Twitter meta ───────────────────────────────
    const ogTitle = getMeta('og:title') || getMeta('twitter:title');
    const ogDesc = getMeta('og:description') || getMeta('twitter:description');
    const ogImage = getMeta('og:image') || getMeta('twitter:image');
    const ogSiteName = getMeta('og:site_name');

    // ── 3. Page <title> ───────────────────────────────────────────
    const titleTagMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const titleTag = titleTagMatch ? decodeHtml(stripTags(titleTagMatch[1])) : '';

    // ── 4. H1 ─────────────────────────────────────────────────────
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Text = h1Match ? decodeHtml(stripTags(h1Match[1])) : '';

    // ── 5. Title Resolution Priority ─────────────────────────────
    let title = (jsonLd?.name || ogTitle || h1Text || titleTag || '').trim();
    if (ogSiteName && title.includes(ogSiteName)) {
      title = title
        .replace(
          new RegExp(`[\\s\\|\\-–—]+${ogSiteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i'),
          ''
        )
        .trim();
    }

    // ── 6. Collect all images ─────────────────────────────────────
    const images = new Set<string>();
    if (ogImage) {
      const imgUrl = ogImage.startsWith('http') ? ogImage : origin + ogImage;
      images.add(imgUrl);
    }
    if (jsonLd?.image) {
      const ji =
        typeof jsonLd.image === 'string'
          ? [jsonLd.image]
          : Array.isArray(jsonLd.image)
          ? jsonLd.image
          : jsonLd.image.url
          ? [jsonLd.image.url]
          : [];
      ji.forEach((u: string) => {
        if (u) images.add(u.startsWith('http') ? u : origin + u);
      });
    }

    const imgTagMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*/gi)];
    for (const m of imgTagMatches) {
      const src = m[1];
      if (
        !src ||
        src.startsWith('data:') ||
        src.includes('logo') ||
        src.includes('icon') ||
        src.includes('avatar') ||
        src.includes('flag')
      )
        continue;
      const ext = src.split('?')[0].toLowerCase();
      if (!ext.endsWith('.jpg') && !ext.endsWith('.jpeg') && !ext.endsWith('.png') && !ext.endsWith('.webp'))
        continue;
      const fullUrl = src.startsWith('http') ? src : src.startsWith('//') ? 'https:' + src : origin + src;
      images.add(fullUrl);
      if (images.size >= 10) break;
    }

    // ── 7. Collect videos ─────────────────────────────────────────
    const videos: string[] = [];
    const iframeSrcs = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
    for (const src of iframeSrcs) {
      if (src.includes('youtube') || src.includes('vimeo') || src.includes('wistia')) {
        videos.push(src.startsWith('http') ? src : 'https:' + src);
      }
    }

    const videoSrcMatches = [
      ...html.matchAll(/<(?:video|source)[^>]+src=["']([^"']+\.(?:mp4|webm|ogg))["']/gi),
    ];
    for (const m of videoSrcMatches) {
      const src = m[1].startsWith('http') ? m[1] : origin + m[1];
      videos.push(src);
    }

    // ── 8. Extract PDF brochure links ──────────────────────────
    const pdfLinks: string[] = [];
    const pdfMatches = [...html.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi)];
    for (const m of pdfMatches) {
      const href = m[1].startsWith('http') ? m[1] : origin + m[1];
      if (!pdfLinks.includes(href)) pdfLinks.push(href);
    }

    // ── 9. Text parsing for features and specs ──────────────────
    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '');

    const allListItems = [...bodyText.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m) => decodeHtml(stripTags(m[1])).trim())
      .filter(
        (t) =>
          t.length > 8 &&
          t.length < 300 &&
          !t.toLowerCase().startsWith('home') &&
          !t.toLowerCase().includes('cookie')
      );

    const sectionPattern = /<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>([\s\S]*?)(?=<h[2-4]|$)/gi;
    const sections: Record<string, string> = {};
    for (const m of bodyText.matchAll(sectionPattern)) {
      const heading = decodeHtml(stripTags(m[1])).trim().toLowerCase();
      const content = decodeHtml(stripTags(m[2])).trim();
      if (content.length > 10) sections[heading] = content;
    }

    // Description resolution priority
    const description = (
      jsonLd?.description ||
      ogDesc ||
      sections['description'] ||
      sections['overview'] ||
      allListItems.slice(0, 5).join('\n') ||
      ''
    ).trim();

    // Spec extraction heuristic
    const specs =
      sections['specifications'] ||
      sections['technical data'] ||
      sections['technical specifications'] ||
      allListItems.slice(0, 8).join('\n') ||
      '';

    return NextResponse.json({
      title,
      description,
      specs,
      images: Array.from(images),
      videos,
      pdfLinks,
    });
  } catch (error: any) {
    console.error('[Import Product Scraper Error]:', error);
    return NextResponse.json({ error: error.message || 'Scraping failed' }, { status: 500 });
  }
}
