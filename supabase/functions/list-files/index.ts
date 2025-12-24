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

    const { data: items, error } = await supabase
      .from("public_library_items")
      .select("id, title_mk, thumbnail_url, pdf_url, image_url, watermark_url, additional_images")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch items: ${error.message}`);
    }

    const imageUrls: string[] = [];
    const pdfUrls: string[] = [];

    for (const item of items || []) {
      if (item.thumbnail_url && !imageUrls.includes(item.thumbnail_url)) imageUrls.push(item.thumbnail_url);
      if (item.image_url && !imageUrls.includes(item.image_url)) imageUrls.push(item.image_url);
      if (item.watermark_url && !imageUrls.includes(item.watermark_url)) imageUrls.push(item.watermark_url);
      if (item.pdf_url && !pdfUrls.includes(item.pdf_url)) pdfUrls.push(item.pdf_url);
      if (item.additional_images && Array.isArray(item.additional_images)) {
        for (const img of item.additional_images) {
          if (img && !imageUrls.includes(img)) imageUrls.push(img);
        }
      }
    }

    const imageUrlsJson = JSON.stringify(imageUrls);
    const pdfUrlsJson = JSON.stringify(pdfUrls);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>File Download Helper</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #333; }
    .summary { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .summary h2 { margin-top: 0; }
    .section { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section h2 { margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .file-list { list-style: none; padding: 0; margin: 0; max-height: 400px; overflow-y: auto; }
    .file-item { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; gap: 10px; }
    .file-item:last-child { border-bottom: none; }
    .file-name { flex: 1; word-break: break-all; font-family: monospace; font-size: 13px; }
    .download-btn { background: #2563eb; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 13px; white-space: nowrap; }
    .download-btn:hover { background: #1d4ed8; }
    .zip-btn { background: #059669; color: white; padding: 12px 24px; border-radius: 6px; border: none; cursor: pointer; font-size: 16px; font-weight: 600; margin-right: 10px; }
    .zip-btn:hover { background: #047857; }
    .zip-btn:disabled { background: #9ca3af; cursor: not-allowed; }
    .instructions { background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b; }
    .instructions h3 { margin-top: 0; color: #92400e; }
    .instructions ol { margin-bottom: 0; }
    .progress-container { display: none; margin-top: 15px; }
    .progress-bar { width: 100%; height: 24px; background: #e5e7eb; border-radius: 12px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #2563eb, #059669); transition: width 0.3s; width: 0%; }
    .progress-text { text-align: center; margin-top: 8px; font-size: 14px; color: #4b5563; }
    .buttons { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
  </style>
</head>
<body>
  <h1>📁 File Download Helper</h1>
  
  <div class="instructions">
    <h3>📋 Instructions</h3>
    <ol>
      <li>Click "Download All Images as ZIP" or "Download All PDFs as ZIP" below</li>
      <li>Wait for the download to complete (may take a few minutes for large files)</li>
      <li>Create <code>library-images</code> (public) and <code>library-pdfs</code> (private) buckets in your new Supabase project</li>
      <li>Extract and upload the downloaded files</li>
      <li>Run <code>docs/update_urls.sql</code> to update URLs</li>
    </ol>
  </div>

  <div class="summary">
    <h2>📊 Summary</h2>
    <p><strong>Total Images:</strong> ${imageUrls.length}</p>
    <p><strong>Total PDFs:</strong> ${pdfUrls.length}</p>
    <p><strong>Total Files:</strong> ${imageUrls.length + pdfUrls.length}</p>
    
    <div class="buttons">
      <button class="zip-btn" onclick="downloadZip('images')">📦 Download All Images as ZIP</button>
      <button class="zip-btn" onclick="downloadZip('pdfs')">📦 Download All PDFs as ZIP</button>
    </div>
    
    <div id="progress-container" class="progress-container">
      <div class="progress-bar">
        <div id="progress-fill" class="progress-fill"></div>
      </div>
      <div id="progress-text" class="progress-text">Preparing download...</div>
    </div>
  </div>

  <div class="section">
    <h2>🖼️ Images (${imageUrls.length} files)</h2>
    <p>These go in your <code>library-images</code> bucket:</p>
    <ul class="file-list">
      ${imageUrls.map(url => {
        const filename = url.split('/').pop() || 'unknown';
        return `<li class="file-item">
          <span class="file-name">${filename}</span>
          <a href="${url}" download="${filename}" class="download-btn" target="_blank">Download</a>
        </li>`;
      }).join('')}
    </ul>
  </div>

  <div class="section">
    <h2>📄 PDFs (${pdfUrls.length} files)</h2>
    <p>These go in your <code>library-pdfs</code> bucket:</p>
    <ul class="file-list">
      ${pdfUrls.map(url => {
        const filename = url.split('/').pop() || 'unknown';
        return `<li class="file-item">
          <span class="file-name">${filename}</span>
          <a href="${url}" download="${filename}" class="download-btn" target="_blank">Download</a>
        </li>`;
      }).join('')}
    </ul>
  </div>

  <script>
    const imageUrls = ${imageUrlsJson};
    const pdfUrls = ${pdfUrlsJson};
    
    async function downloadZip(type) {
      const urls = type === 'images' ? imageUrls : pdfUrls;
      const filename = type === 'images' ? 'library-images.zip' : 'library-pdfs.zip';
      
      const progressContainer = document.getElementById('progress-container');
      const progressFill = document.getElementById('progress-fill');
      const progressText = document.getElementById('progress-text');
      
      progressContainer.style.display = 'block';
      progressFill.style.width = '0%';
      progressText.textContent = 'Starting download...';
      
      const zip = new JSZip();
      let completed = 0;
      const total = urls.length;
      const failed = [];
      
      // Download files in parallel batches of 5
      const batchSize = 5;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const blob = await response.blob();
            const name = url.split('/').pop() || 'file';
            zip.file(name, blob);
          } catch (err) {
            console.error('Failed to download:', url, err);
            failed.push(url);
          }
          completed++;
          const percent = Math.round((completed / total) * 100);
          progressFill.style.width = percent + '%';
          progressText.textContent = 'Downloaded ' + completed + ' of ' + total + ' files...';
        }));
      }
      
      if (failed.length > 0) {
        progressText.textContent = 'Creating ZIP... (' + failed.length + ' files failed)';
        console.log('Failed files:', failed);
      } else {
        progressText.textContent = 'Creating ZIP file...';
      }
      
      try {
        const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
          progressText.textContent = 'Compressing: ' + Math.round(metadata.percent) + '%';
        });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        
        progressText.textContent = 'Download complete! ' + (total - failed.length) + ' files in ZIP.';
        if (failed.length > 0) {
          progressText.textContent += ' (' + failed.length + ' failed - check console)';
        }
      } catch (err) {
        progressText.textContent = 'Error creating ZIP: ' + err.message;
        console.error('ZIP error:', err);
      }
    }
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", error);
    return new Response(
      `<!DOCTYPE html><html><body><h1>Error</h1><p>${errorMessage}</p></body></html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
});
