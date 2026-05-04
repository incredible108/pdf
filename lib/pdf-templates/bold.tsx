import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { ResumeData, PDFTemplateProps } from "./types"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 25,
    backgroundColor: "#1A1A2E",
    margin: -40,
    marginBottom: 25,
    padding: 35,
    paddingTop: 40,
  },
  name: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: "#E94560",
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  contactItem: {
    fontSize: 9,
    color: "#CCCCCC",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A2E",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingBottom: 6,
    borderBottom: "3pt solid #E94560",
  },
  summaryText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.6,
  },
  experienceItem: {
    marginBottom: 14,
  },
  experienceHeader: {
    backgroundColor: "#F8F8F8",
    padding: 10,
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A2E",
    textTransform: "uppercase",
  },
  companyDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  company: {
    fontSize: 10,
    color: "#E94560",
    fontFamily: "Helvetica-Bold",
  },
  dateRange: {
    fontSize: 9,
    color: "#666666",
  },
  bulletPoint: {
    fontSize: 9,
    color: "#444444",
    marginBottom: 4,
    paddingLeft: 12,
  },
  educationItem: {
    marginBottom: 10,
    backgroundColor: "#F8F8F8",
    padding: 10,
  },
  degree: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1A1A2E",
    textTransform: "uppercase",
  },
  institution: {
    fontSize: 9,
    color: "#666666",
    marginTop: 3,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillItem: {
    fontSize: 9,
    color: "#FFFFFF",
    backgroundColor: "#1A1A2E",
    padding: "6 12",
    fontFamily: "Helvetica-Bold",
  },
})

export function BoldTemplate({ data }: PDFTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <View style={styles.titleUnderline} />
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
            {data.personalInfo.linkedin && (
              <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>
            )}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <View style={styles.companyDate}>
                    <Text style={styles.company}>{exp.company}</Text>
                    <Text style={styles.dateRange}>{exp.date}</Text>
                  </View>
                </View>
                {exp.highlights.map((highlight, hIndex) => (
                  <Text key={hIndex} style={styles.bulletPoint}>
                    ■ {highlight}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={[styles.educationItem, index > 0 ? { marginTop: 8 } : {}]}>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.institution}>
                  {edu.institution} | {edu.year}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

export const boldMeta = {
  id: "bold" as const,
  name: "Bold",
  description: "Strong impactful design with dark header",
  preview: {
    headerColor: "#1A1A2E",
    accentColor: "#E94560",
    bgColor: "#ffffff",
  },
}
