import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OLD_SUPABASE_URL = "https://kkvjdxxrhvcmfavbreso.supabase.co";
    const OLD_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdmpkeHhyaHZjbWZhdmJyZXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzM1MzQsImV4cCI6MjA3NjMwOTUzNH0.C-h80C4_LvkmBfacdzGl1oAH2PfSmfcUu62bSdVMAD0";

    const supabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);

    // Fetch all library items
    const { data: items, error } = await supabase
      .from("public_library_items")
      .select("id, title_mk, thumbnail_url, pdf_url, image_url, watermark_url, additional_images")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch items: ${error.message}`);
    }

    // Collect all unique URLs
    const imageUrls = new Set<string>();
    const pdfUrls = new Set<string>();

    for (const item of items || []) {
      if (item.thumbnail_url) imageUrls.add(item.thumbnail_url);
      if (item.image_url) imageUrls.add(item.image_url);
      if (item.watermark_url) imageUrls.add(item.watermark_url);
      if (item.pdf_url) pdfUrls.add(item.pdf_url);
      if (item.additional_images && Array.isArray(item.additional_images)) {
        for (const img of item.additional_images) {
          if (img) imageUrls.add(img);
        }
      }
    }

    // Generate HTML page
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>File Download Helper</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .summary { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .summary h2 { margin-top: 0; }
    .section { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section h2 { margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .file-list { list-style: none; padding: 0; margin: 0; }
    .file-item { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; gap: 10px; }
    .file-item:last-child { border-bottom: none; }
    .file-name { flex: 1; word-break: break-all; font-family: monospace; font-size: 13px; }
    .download-btn { background: #2563eb; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 13px; white-space: nowrap; }
    .download-btn:hover { background: #1d4ed8; }
    .instructions { background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b; }
    .instructions h3 { margin-top: 0; color: #92400e; }
    .instructions ol { margin-bottom: 0; }
    .copy-btn { background: #6b7280; color: white; padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; font-size: 13px; }
    .copy-btn:hover { background: #4b5563; }
    .url-list { background: #1f2937; color: #e5e7eb; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px; max-height: 300px; overflow-y: auto; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <h1>📁 File Download Helper</h1>
  
  <div class="instructions">
    <h3>📋 Instructions</h3>
    <ol>
      <li>Download all files below (use a browser extension like "DownThemAll" for bulk download)</li>
      <li>Create <code>library-images</code> (public) and <code>library-pdfs</code> (private) buckets in your new Supabase project</li>
      <li>Upload the downloaded files keeping the same filenames</li>
      <li>Run <code>docs/update_urls.sql</code> to update URLs</li>
    </ol>
  </div>

  <div class="summary">
    <h2>📊 Summary</h2>
    <p><strong>Total Images:</strong> ${imageUrls.size}</p>
    <p><strong>Total PDFs:</strong> ${pdfUrls.size}</p>
    <p><strong>Total Files:</strong> ${imageUrls.size + pdfUrls.size}</p>
  </div>

  <div class="section">
    <h2>🖼️ Images (${imageUrls.size} files)</h2>
    <p>Save these to your <code>library-images</code> bucket:</p>
    <button class="copy-btn" onclick="copyUrls('image-urls')">Copy All Image URLs</button>
    <div id="image-urls" class="url-list" style="margin-top: 10px; display: none;">${Array.from(imageUrls).join('\n')}</div>
    <ul class="file-list">
      ${Array.from(imageUrls).map(url => {
        const filename = url.split('/').pop() || 'unknown';
        return `<li class="file-item">
          <span class="file-name">${filename}</span>
          <a href="${url}" download="${filename}" class="download-btn" target="_blank">Download</a>
        </li>`;
      }).join('')}
    </ul>
  </div>

  <div class="section">
    <h2>📄 PDFs (${pdfUrls.size} files)</h2>
    <p>Save these to your <code>library-pdfs</code> bucket:</p>
    <button class="copy-btn" onclick="copyUrls('pdf-urls')">Copy All PDF URLs</button>
    <div id="pdf-urls" class="url-list" style="margin-top: 10px; display: none;">${Array.from(pdfUrls).join('\n')}</div>
    <ul class="file-list">
      ${Array.from(pdfUrls).map(url => {
        const filename = url.split('/').pop() || 'unknown';
        return `<li class="file-item">
          <span class="file-name">${filename}</span>
          <a href="${url}" download="${filename}" class="download-btn" target="_blank">Download</a>
        </li>`;
      }).join('')}
    </ul>
  </div>

  <script>
    function copyUrls(elementId) {
      const el = document.getElementById(elementId);
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
      navigator.clipboard.writeText(el.textContent);
      alert('URLs copied to clipboard!');
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
