'use client'

import React, { useState } from 'react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null)
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(`Error: ${data.error || 'Upload failed'}`)
      } else {
        setMessage(`Upload successful: ${data.fileName}`)
        setFile(null)
      }
    } catch (error) {
      setMessage('Upload failed: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload File</h1>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-700 border border-gray-300 rounded px-2 py-1"
        disabled={uploading}
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </main>
  )
}
