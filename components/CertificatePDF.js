'use client'

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

// Use standard PDF fonts that work without external requests
// Inter is used as fallback name, but we'll map to Helvetica
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 700 },
  ]
})

Font.register({
  family: 'SpaceGrotesk',
  fonts: [
    { src: 'Helvetica-Bold', fontWeight: 700 },
  ]
})

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#000000',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: '2px solid #00ff66',
    margin: 20,
    borderRadius: 8,
  },
  borderInner: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    border: '1px solid #00ff66',
    borderRadius: 4,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    paddingTop: 30,
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontFamily: 'SpaceGrotesk',
    fontSize: 36,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: 4,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#66ff99',
    letterSpacing: 8,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  divider: {
    width: 120,
    height: 2,
    backgroundColor: '#00ff66',
    marginBottom: 20,
  },
  awardedTo: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 6,
  },
  name: {
    fontFamily: 'SpaceGrotesk',
    fontSize: 42,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 4,
  },
  nameUnderline: {
    width: 200,
    height: 2,
    backgroundColor: '#00ff66',
    marginBottom: 20,
    opacity: 0.5,
  },
  bodyText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#d1d5db',
    maxWidth: 400,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginBottom: 20,
  },
  detailBox: {
    alignItems: 'center',
    borderRight: '1px solid #1a1a2e',
    paddingRight: 30,
  },
  detailBoxLast: {
    alignItems: 'center',
    paddingLeft: 0,
  },
  detailLabel: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailValue: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: 600,
    color: '#ffffff',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingHorizontal: 50,
  },
  footerText: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: '#4a4a5e',
    letterSpacing: 1,
  },
  certId: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#4a4a5e',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#00ff66',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gradeText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 700,
    color: '#66ff99',
    marginBottom: 16,
  },
})

export function CertificatePDF({ data }) {
  const {
    full_name,
    field,
    cohort_name,
    grade,
    cert_id,
    internee_id,
    start_date,
    end_date,
  } = data

  const period = start_date && end_date
    ? `${new Date(start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} — ${new Date(end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    : ''

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background decorations */}
        <View style={styles.background} />
        <View style={styles.borderInner} />
        
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logo}>
            <Image src="/NFS.png" style={{ width: 80, height: 80 }} />
          </View>

          <Text style={styles.title}>NEUROFIVE STUDIO</Text>
          <Text style={styles.subtitle}>Internship Certificate</Text>

          <View style={styles.divider} />

          <Text style={styles.awardedTo}>Awarded To</Text>
          <Text style={styles.name}>{full_name}</Text>
          <View style={styles.nameUnderline} />

          <Text style={styles.bodyText}>
            Has successfully completed the internship program in{' '}
            <Text style={{ color: '#ffffff', fontWeight: 600 }}>{field}</Text>{' '}
            demonstrating exceptional skill, dedication, and professional growth.
          </Text>

          {grade && (
            <Text style={styles.gradeText}>Grade: {grade}</Text>
          )}

          <View style={styles.detailsRow}>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Track</Text>
              <Text style={styles.detailValue}>{field}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>Cohort</Text>
              <Text style={styles.detailValue}>{cohort_name}</Text>
            </View>
            <View style={[styles.detailBox, styles.detailBoxLast]}>
              <Text style={styles.detailLabel}>Period</Text>
              <Text style={styles.detailValue}>{period || '—'}</Text>
            </View>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ Verified</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Issued by NeuroFive Solutions</Text>
          {cert_id && (
            <Text style={styles.certId}>Certificate ID: {cert_id}</Text>
          )}
        </View>
      </Page>
    </Document>
  )
}