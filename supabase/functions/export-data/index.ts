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
    // Use the OLD project credentials to fetch data
    const OLD_SUPABASE_URL = "https://kkvjdxxrhvcmfavbreso.supabase.co";
    const OLD_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdmpkeHhyaHZjbWZhdmJyZXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzM1MzQsImV4cCI6MjA3NjMwOTUzNH0.C-h80C4_LvkmBfacdzGl1oAH2PfSmfcUu62bSdVMAD0";

    const supabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);

    // Fetch all library items using the public view
    const { data: items, error } = await supabase
      .from("public_library_items")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch items: ${error.message}`);
    }

    // Generate SQL INSERT statements
    const sqlStatements: string[] = [];
    
    sqlStatements.push(`-- ============================================`);
    sqlStatements.push(`-- LIBRARY ITEMS DATA EXPORT`);
    sqlStatements.push(`-- Generated: ${new Date().toISOString()}`);
    sqlStatements.push(`-- Total items: ${items?.length || 0}`);
    sqlStatements.push(`-- ============================================`);
    sqlStatements.push(``);
    sqlStatements.push(`-- IMPORTANT: Run this AFTER importing categories, languages, and newspapers`);
    sqlStatements.push(`-- IMPORTANT: Run update_urls.sql AFTER uploading files to new storage buckets`);
    sqlStatements.push(``);

    for (const item of items || []) {
      const escapeString = (val: string | null | undefined): string => {
        if (val === null || val === undefined) return "NULL";
        return `'${val.replace(/'/g, "''")}'`;
      };

      const formatArray = (arr: string[] | null | undefined): string => {
        if (!arr || arr.length === 0) return "'{}'";
        const escaped = arr.map(v => v.replace(/'/g, "''").replace(/"/g, '\\"'));
        return `ARRAY[${escaped.map(v => `'${v}'`).join(", ")}]`;
      };

      const sql = `INSERT INTO library_items (
  id, type, title_mk, title_en, author, author_en, year, year_mk, year_en,
  language, category, keywords, description_mk, description_en,
  thumbnail_url, pdf_url, image_url, additional_images,
  publication_city, publication_city_en, publisher, publisher_en,
  type_mk, type_en, source_mk, source_en, issue_number_mk, issue_number_en,
  watermark_url, watermark_link, created_at, updated_at
) VALUES (
  ${escapeString(item.id)},
  ${escapeString(item.type)},
  ${escapeString(item.title_mk)},
  ${escapeString(item.title_en)},
  ${escapeString(item.author)},
  ${escapeString(item.author_en)},
  ${escapeString(item.year)},
  ${escapeString(item.year_mk)},
  ${escapeString(item.year_en)},
  ${formatArray(item.language)},
  ${formatArray(item.category)},
  ${formatArray(item.keywords)},
  ${escapeString(item.description_mk)},
  ${escapeString(item.description_en)},
  ${escapeString(item.thumbnail_url)},
  ${escapeString(item.pdf_url)},
  ${escapeString(item.image_url)},
  ${formatArray(item.additional_images)},
  ${escapeString(item.publication_city)},
  ${escapeString(item.publication_city_en)},
  ${escapeString(item.publisher)},
  ${escapeString(item.publisher_en)},
  ${escapeString(item.type_mk)},
  ${escapeString(item.type_en)},
  ${escapeString(item.source_mk)},
  ${escapeString(item.source_en)},
  ${escapeString(item.issue_number_mk)},
  ${escapeString(item.issue_number_en)},
  ${escapeString(item.watermark_url)},
  ${escapeString(item.watermark_link)},
  ${escapeString(item.created_at)},
  ${escapeString(item.updated_at)}
) ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  title_mk = EXCLUDED.title_mk,
  title_en = EXCLUDED.title_en,
  author = EXCLUDED.author,
  author_en = EXCLUDED.author_en,
  year = EXCLUDED.year,
  year_mk = EXCLUDED.year_mk,
  year_en = EXCLUDED.year_en,
  language = EXCLUDED.language,
  category = EXCLUDED.category,
  keywords = EXCLUDED.keywords,
  description_mk = EXCLUDED.description_mk,
  description_en = EXCLUDED.description_en,
  thumbnail_url = EXCLUDED.thumbnail_url,
  pdf_url = EXCLUDED.pdf_url,
  image_url = EXCLUDED.image_url,
  additional_images = EXCLUDED.additional_images,
  publication_city = EXCLUDED.publication_city,
  publication_city_en = EXCLUDED.publication_city_en,
  publisher = EXCLUDED.publisher,
  publisher_en = EXCLUDED.publisher_en,
  type_mk = EXCLUDED.type_mk,
  type_en = EXCLUDED.type_en,
  source_mk = EXCLUDED.source_mk,
  source_en = EXCLUDED.source_en,
  issue_number_mk = EXCLUDED.issue_number_mk,
  issue_number_en = EXCLUDED.issue_number_en,
  watermark_url = EXCLUDED.watermark_url,
  watermark_link = EXCLUDED.watermark_link,
  updated_at = EXCLUDED.updated_at;`;

      sqlStatements.push(sql);
      sqlStatements.push(``);
    }

    const fullSql = sqlStatements.join("\n");

    return new Response(fullSql, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": "attachment; filename=data_export_items.sql",
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Export error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
