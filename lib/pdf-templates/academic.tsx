import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { ResumeData, PDFTemplateProps } from "./types"

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.5,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: "1pt solid #333333",
    paddingBottom: 15,
  },
  name: {
    fontSize: 22,
    fontFamily: "Times-Bold",
    color: "#1a1a1a",
    marginBottom: 6,
    letterSpacing: 1,
  },
  contactInfo: {
    fontSize: 10,
    color: "#444444",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    color: "#1a1a1a",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottom: "0.5pt solid #999999",
    paddingBottom: 3,
  },
  summaryText: {
    fontSize: 10,
    color: "#333333",
    textAlign: "justify",
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: "#1a1a1a",
  },
  dateRange: {
    fontSize: 10,
    color: "#555555",
    fontFamily: "Times-Italic",
  },
  company: {
    fontSize: 10,
    color: "#444444",
    marginBottom: 4,
    fontFamily: "Times-Italic",
  },
  bulletPoint: {
    fontSize: 10,
    color: "#333333",
    marginLeft: 15,
    marginBottom: 2,
  },
  educationItem: {
    marginBottom: 8,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  degree: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    color: "#1a1a1a",
  },
  institution: {
    fontSize: 10,
    color: "#444444",
    fontFamily: "Times-Italic",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillItem: {
    fontSize: 10,
    color: "#333333",
    backgroundColor: "#f5f5f5",
    padding: "4 8",
    borderRadius: 2,
  },
})

export function AcademicTemplate({ data }: PDFTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <Text style={styles.contactInfo}>
            {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
          </Text>
          {data.personalInfo.linkedin && (
            <Text style={styles.contactInfo}>{data.personalInfo.linkedin}</Text>
          )}
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.dateRange}>{exp.date}</Text>
                </View>
                <Text style={styles.company}>{exp.company}</Text>
                {exp.highlights.map((highlight, hIndex) => (
                  <Text key={hIndex} style={styles.bulletPoint}>
                    • {highlight}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={[styles.educationItem, index > 0 ? { marginTop: 8 } : {}]}>
                <View style={styles.educationHeader}>
                  <Text style={styles.degree}>{edu.degree}</Text>
                  <Text style={styles.dateRange}>{edu.year}</Text>
                </View>
                <Text style={styles.institution}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Areas of Expertise</Text>
            <View style={styles.skillsContainer}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}

export const academicMeta = {
  id: "academic" as const,
  name: "Academic",
  description: "Formal scholarly style with Times Roman typography",
  preview: {
    headerColor: "#1a1a1a",
    accentColor: "#333333",
    bgColor: "#ffffff",
  },
}
