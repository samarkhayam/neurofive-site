'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'

// Standard built-in PDF fonts — no external requests needed
Font.register({
  family: 'Helvetica',
  src: 'Helvetica',
})

// A4 Landscape: 841.89 x 595.28 pt
const W = 841.89
const H = 595.28

const C = {
  black:      '#000000',
  white:      '#ffffff',
  accent:     '#00ff66',
  accentDim:  '#00cc52',
  gold:       '#66ff99',
  muted:      '#9ca3af',
  mutedDark:  '#6b7280',
  surface:    '#0d0d0d',
  card:       '#111118',
  border:     '#003314',
  borderDim:  '#001a0a',
}

const styles = StyleSheet.create({
  page: {
    width: W,
    height: H,
    backgroundColor: C.black,
    position: 'relative',
    fontFamily: 'Helvetica',
  },

  // ── Outer border frame ──────────────────────────────────────────
  frameBorder: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    bottom: 18,
    border: `2.5pt solid ${C.accent}`,
    borderRadius: 4,
  },
  frameInner: {
    position: 'absolute',
    top: 26,
    left: 26,
    right: 26,
    bottom: 26,
    border: `0.5pt solid ${C.border}`,
    borderRadius: 2,
  },

  // ── Corner accents ──────────────────────────────────────────────
  cornerTL: { position: 'absolute', top: 32, left: 32, width: 20, height: 20,
    borderTop: `2pt solid ${C.accent}`, borderLeft: `2pt solid ${C.accent}` },
  cornerTR: { position: 'absolute', top: 32, right: 32, width: 20, height: 20,
    borderTop: `2pt solid ${C.accent}`, borderRight: `2pt solid ${C.accent}` },
  cornerBL: { position: 'absolute', bottom: 32, left: 32, width: 20, height: 20,
    borderBottom: `2pt solid ${C.accent}`, borderLeft: `2pt solid ${C.accent}` },
  cornerBR: { position: 'absolute', bottom: 32, right: 32, width: 20, height: 20,
    borderBottom: `2pt solid ${C.accent}`, borderRight: `2pt solid ${C.accent}` },

  // ── Left sidebar ─────────────────────────────────────────────────
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: H,
    backgroundColor: C.surface,
    borderRight: `1.5pt solid ${C.border}`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  sidebarAccentBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 3,
    height: H,
    backgroundColor: C.accent,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 14,
    objectFit: 'contain',
  },
  orgName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    lineHeight: 1.4,
  },
  orgSub: {
    fontSize: 7.5,
    color: C.muted,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  sidebarDivider: {
    width: 40,
    height: 1,
    backgroundColor: C.accent,
    marginVertical: 16,
    opacity: 0.6,
  },
  sidebarLabel: {
    fontSize: 7,
    color: C.muted,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sidebarValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    marginTop: 18,
    backgroundColor: C.accent,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.black,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // ── Main content area ────────────────────────────────────────────
  main: {
    position: 'absolute',
    top: 0,
    left: 200,
    right: 0,
    height: H,
    paddingTop: 52,
    paddingBottom: 52,
    paddingLeft: 52,
    paddingRight: 44,
    justifyContent: 'space-between',
  },

  // Top section
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  certLabel: {
    fontSize: 8,
    color: C.accent,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  certTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  certSubtitle: {
    fontSize: 9,
    color: C.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  certNumber: {
    fontSize: 8,
    color: C.mutedDark,
    letterSpacing: 1,
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },

  // Middle — name block
  middle: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  presentedTo: {
    fontSize: 8,
    color: C.muted,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  recipientName: {
    fontSize: 44,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 1,
    lineHeight: 1.15,
    marginBottom: 8,
  },
  nameUnderline: {
    width: 80,
    height: 2.5,
    backgroundColor: C.accent,
    marginBottom: 16,
    borderRadius: 2,
  },
  bodyText: {
    fontSize: 11,
    color: C.muted,
    lineHeight: 1.7,
    maxWidth: 460,
  },
  trackHighlight: {
    color: C.white,
    fontFamily: 'Helvetica-Bold',
  },

  // Bottom details row
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderTop: `0.5pt solid ${C.borderDim}`,
    paddingTop: 16,
  },
  detailsGroup: {
    flexDirection: 'row',
    gap: 32,
  },
  detailItem: {
    minWidth: 90,
  },
  detailLabel: {
    fontSize: 7,
    color: C.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 0.3,
  },
  gradeValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    letterSpacing: 0.3,
  },

  // Verify link block
  verifyBlock: {
    alignItems: 'flex-end',
  },
  verifyLabel: {
    fontSize: 7,
    color: C.mutedDark,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  verifyUrl: {
    fontSize: 8,
    color: C.accent,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  issuedBy: {
    fontSize: 7,
    color: C.mutedDark,
    letterSpacing: 0.5,
    marginTop: 4,
  },
})

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function CertificatePDF({ data }) {
  const {
    full_name = '',
    field = '',
    cohort_name = '',
    grade,
    cert_id,
    internee_id,
    start_date,
    end_date,
  } = data

  const displayId = cert_id || internee_id || '—'
  const period =
    start_date && end_date
      ? `${formatDate(start_date)} – ${formatDate(end_date)}`
      : '—'

  // Break long names gracefully
  const nameSize = full_name.length > 22 ? 34 : full_name.length > 16 ? 40 : 44

  return (
    <Document>
      <Page size={[W, H]} orientation="landscape" style={styles.page}>

        {/* ── Borders & corners ── */}
        <View style={styles.frameBorder} />
        <View style={styles.frameInner} />
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />

        {/* ── Left sidebar ── */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarAccentBar} />

          <Image src="/NFS.png" style={styles.logo} />

          <Text style={styles.orgName}>NeuroFive{'\n'}Solutions</Text>
          <Text style={styles.orgSub}>Builder Ecosystem</Text>

          <View style={styles.sidebarDivider} />

          <Text style={styles.sidebarLabel}>Cohort</Text>
          <Text style={styles.sidebarValue}>{cohort_name || '—'}</Text>

          {grade && (
            <>
              <View style={[styles.sidebarDivider, { marginVertical: 12 }]} />
              <Text style={styles.sidebarLabel}>Grade</Text>
              <Text style={[styles.sidebarValue, { color: C.gold }]}>{grade}</Text>
            </>
          )}

          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        </View>

        {/* ── Main content ── */}
        <View style={styles.main}>

          {/* Top row */}
          <View style={styles.topRow}>
            <View>
              <Text style={styles.certLabel}>Certificate of Completion</Text>
              <Text style={styles.certTitle}>Internship</Text>
              <Text style={styles.certSubtitle}>NeuroFive Solutions — Official Document</Text>
            </View>
            <View>
              <Text style={styles.certNumber}>No. {displayId}</Text>
              <Text style={[styles.certNumber, { marginTop: 3 }]}>
                Issued {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
          </View>

          {/* Name + body */}
          <View style={styles.middle}>
            <Text style={styles.presentedTo}>This is to certify that</Text>
            <Text style={[styles.recipientName, { fontSize: nameSize }]}>
              {full_name}
            </Text>
            <View style={styles.nameUnderline} />
            <Text style={styles.bodyText}>
              has successfully completed the internship program in{' '}
              <Text style={styles.trackHighlight}>{field}</Text>,
              demonstrating exceptional skill, dedication, and professional
              growth throughout the program duration.
            </Text>
          </View>

          {/* Bottom details */}
          <View style={styles.bottomRow}>
            <View style={styles.detailsGroup}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Track</Text>
                <Text style={styles.detailValue}>{field}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Period</Text>
                <Text style={styles.detailValue}>{period}</Text>
              </View>
              {grade && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Grade</Text>
                  <Text style={styles.gradeValue}>{grade}</Text>
                </View>
              )}
            </View>

            <View style={styles.verifyBlock}>
              <Text style={styles.verifyLabel}>Verify this certificate</Text>
              <Text style={styles.verifyUrl}>neurofivesolutions.com/verify-certificate</Text>
              <Text style={styles.issuedBy}>Issued by NeuroFive Solutions · {displayId}</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  )
}