'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [files, setFiles] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && selected.size <= 1024 * 1024) {
      setFile(selected)
    } else {
      alert('File must be less than 1MB.')
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setProgress(10)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setProgress(100)
    setUploading(false)

    if (res.ok) {
      setFiles(prev => [...prev, data.fileName])
      setFile(null)
    } else {
      alert('Upload failed: ' + data.error)
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-3xl mb-2">Upload</h1>
        <p className="text-muted-foreground">Upload your files to Supabase securely.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" onChange={handleFileChange} />
          {file && <div className="text-sm text-muted-foreground">{file.name}</div>}
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          {uploading && <Progress value={progress} />}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm list-disc pl-5 space-y-1">
              {files.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
