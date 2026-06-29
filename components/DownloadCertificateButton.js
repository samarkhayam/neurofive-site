'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { CertificatePDF } from './CertificatePDF'
import { supabase } from '@/lib/supabase'

export function DownloadCertificateButton({ interneeId, children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownload = async () => {
    setLoading(true)
    setError('')

    try {
      // 1. Fetch full internee data
      const { data: internee, error: fetchError } = await supabase
        .from('internees')
        .select(`
          id,
          full_name,
          field,
          grade,
          cert_id,
          internee_id,
          start_date,
          end_date,
          cohort_id,
          cohorts (name)
        `)
        .eq('id', interneeId)
        .single()

      if (fetchError) {
        throw new Error('Failed to fetch certificate data')
      }

      // 2. Update last_cert_requested_at
      await supabase
        .from('internees')
        .update({ last_cert_requested_at: new Date().toISOString() })
        .eq('id', interneeId)

      // 3. Prepare data for PDF
      const pdfData = {
        full_name: internee.full_name,
        field: internee.field,
        cohort_name: internee.cohorts?.name || '—',
        grade: internee.grade,
        cert_id: internee.cert_id || internee.internee_id,
        internee_id: internee.internee_id,
        start_date: internee.start_date,
        end_date: internee.end_date,
      }

      // 4. Generate PDF
      const blob = await pdf(<CertificatePDF data={pdfData} />).toBlob()
      
      // 5. Download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Certificate-${internee.full_name.replace(/\s/g, '_')}-${internee.internee_id || 'NFS'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

    } catch (err) {
      console.error('Download error:', err)
      setError(err.message || 'Failed to download certificate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={loading ? 'opacity-50 cursor-not-allowed' : ''}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin mr-2" aria-hidden="true" />
            Generating...
          </>
        ) : (
          children || 'Download Certificate'
        )}
      </button>
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}