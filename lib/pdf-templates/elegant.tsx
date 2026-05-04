import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { ResumeData, PDFTemplateProps } from "./types"

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    backgroundColor: "#FDFCFB",
  },
  header: {
    marginBottom: 25,
    textAlign: "center",
  },
  name: {
    fontSize: 28,
    fontFamily: "Helvetica",
    color: "#2C2C2C",
    marginBottom: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: "#C9A962",
    marginHorizontal: "auto",
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 9,
    color: "#666666",
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#C9A962",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },
  summaryText: {
    fontSize: 10,
    color: "#444444",
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 1.7,
    fontStyle: "italic",
  },
  experienceItem: {
    marginBottom: 14,
  },
  experienceHeader: {
    textAlign: "center",
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2C2C2C",
  },
  company: {
    fontSize: 10,
    color: "#C9A962",
    marginTop: 2,
  },
  dateRange: {
    fontSize: 9,
    color: "#888888",
    marginTop: 2,
  },
  bulletPoint: {
    fontSize: 9,
    color: "#555555",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  educationItem: {
    marginBottom: 10,
    textAlign: "center",
  },
  degree: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2C2C2C",
  },
  institution: {
    fontSize: 9,
    color: "#666666",
    marginTop: 2,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  skillItem: {
    fontSize: 9,
    color: "#2C2C2C",
    padding: "4 12",
    borderRadius: 12,
    border: "0.5pt solid #C9A962",
  },
  sectionDivider: {
    width: 40,
    height: 0.5,
    backgroundColor: "#E5E5E5",
    marginHorizontal: "auto",
    marginTop: 18,
  },
})

export function ElegantTemplate({ data }: PDFTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <View style={styles.divider} />
          <Text style={styles.contactInfo}>
            {data.personalInfo.email}  •  {data.personalInfo.phone}  •  {data.personalInfo.location}
          </Text>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
            <View style={styles.sectionDivider} />
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
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.dateRange}>{exp.date}</Text>
                </View>
                {exp.highlights.map((highlight, hIndex) => (
                  <Text key={hIndex} style={styles.bulletPoint}>
                    {highlight}
                  </Text>
                ))}
              </View>
            ))}
            <View style={styles.sectionDivider} />
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
                  {edu.institution}  •  {edu.year}
                </Text>
              </View>
            ))}
            <View style={styles.sectionDivider} />
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expertise</Text>
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

export const elegantMeta = {
  id: "elegant" as const,
  name: "Elegant",
  description: "Refined centered layout with gold accents",
  preview: {
    headerColor: "#2C2C2C",
    accentColor: "#C9A962",
    bgColor: "#FDFCFB",
  },
}
