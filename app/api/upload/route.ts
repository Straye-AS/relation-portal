import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as Blob | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const sanitizedFileName = 'uploaded_file.png' // İsteğe göre
  const fileName = `${Date.now()}_${sanitizedFileName}`

  const { error } = await supabaseAdmin.storage
    .from('neosaas')
    .upload(`public/${fileName}`, buffer, {
      contentType: 'image/png',
      upsert: true,
      cacheControl: '3600',
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, fileName }, { status: 200 })
}
