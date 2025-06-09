import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Buffer } from 'buffer'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Dosya adı özel karakterlerden temizleniyor
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const fileName = `${Date.now()}_${sanitizedFileName}`

  // Dosyanın content-type'ı formdan alınmalı
  const contentType = file.type || 'application/octet-stream'

  console.log('Uploading file:', fileName, 'with contentType:', contentType)

  const { error } = await supabaseAdmin.storage
    .from('neosaas')
    .upload(`public/${fileName}`, buffer, {
      contentType,
      upsert: true,
      cacheControl: '3600',
    })

  if (error) {
    console.error('Supabase upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, fileName }, { status: 200 })
}
