import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { ResumeData, PDFTemplateProps } from "./types"

const styles = StyleSheet.create({
  page: {
    padding: 45,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1pt solid #003366",
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#003366",
  },
  contactColumn: {
    alignItems: "flex-end",
  },
  contactItem: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionIcon: {
    width: 18,
    height: 18,
    backgroundColor: "#003366",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#003366",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.6,
    paddingLeft: 26,
  },
  experienceItem: {
    marginBottom: 12,
    paddingLeft: 26,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  dateRange: {
    fontSize: 9,
    color: "#003366",
    fontFamily: "Helvetica-Bold",
  },
  company: {
    fontSize: 10,
    color: "#555555",
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 9,
    color: "#444444",
    marginBottom: 3,
    paddingLeft: 10,
  },
  educationItem: {
    marginBottom: 8,
    paddingLeft: 26,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  degree: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  institution: {
    fontSize: 9,
    color: "#555555",
    marginTop: 2,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingLeft: 26,
  },
  skillItem: {
    fontSize: 9,
    color: "#003366",
    backgroundColor: "#E8EEF4",
    padding: "4 10",
    borderRadius: 2,
  },
})

export function CorporateTemplate({ data }: PDFTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.name}>{data.personalInfo.fullName}</Text>
            <View style={styles.contactColumn}>
              <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
              <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
              <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
              {data.personalInfo.linkedin && (
                <Text style={styles.contactItem}>{data.personalInfo.linkedin}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Executive Summary</Text>
            </View>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Professional Experience</Text>
            </View>
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
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
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
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Core Competencies</Text>
            </View>
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

export const corporateMeta = {
  id: "corporate" as const,
  name: "Corporate",
  description: "Professional business style with navy blue accents",
  preview: {
    headerColor: "#003366",
    accentColor: "#003366",
    bgColor: "#ffffff",
  },
}
