import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename & create unique name
    const ext = file.name.split('.').pop() || 'webp';
    const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
    const uniqueName = `${cleanBase}-${Date.now()}.${ext}`;

    // 1. Try uploading to Supabase Storage bucket 'products' or 'public'
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.storage
        .from('products')
        .upload(`gallery/${uniqueName}`, buffer, {
          contentType: file.type || 'image/webp',
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(data.path);
        if (publicUrlData?.publicUrl) {
          return NextResponse.json({ url: publicUrlData.publicUrl, filename: uniqueName });
        }
      }
    } catch (supabaseErr) {
      // Supabase storage bucket not yet provisioned; fall back to local disk
    }

    // 2. Fallback: Save locally into public/uploads/2026/09/
    const uploadDir = join(process.cwd(), 'public', 'uploads', '2026', '09');
    await mkdir(uploadDir, { recursive: true });
    const localPath = join(uploadDir, uniqueName);
    await writeFile(localPath, buffer);

    const publicUrl = `/uploads/2026/09/${uniqueName}`;
    return NextResponse.json({ url: publicUrl, filename: uniqueName });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
