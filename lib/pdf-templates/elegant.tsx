import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import type { ResumeData } from "../parse-resume"

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
    marginBottom: 18,
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
    marginBottom: 9,
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
  bulletItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    color: "#555555",
  },
  bulletPoint: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 4,
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
    gap: 8,
    paddingHorizontal: 20,
  },
  skillItem: {
    fontSize: 9,
    color: "#2C2C2C",
    padding: "4 4",
    borderRadius: 10,
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

export function ElegantTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, summary, skills, workexperience } = data
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          <View style={styles.divider} />
          <Text style={styles.contactInfo}>
            {personalInfo.email}  •  {personalInfo.phone}  •  {personalInfo.location}
          </Text>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.summaryText}>{summary}</Text>
            <View style={styles.sectionDivider} />
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expertise</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {workexperience && workexperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {workexperience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.role}</Text>
                  <Text style={styles.company}>{exp.companyname}</Text>
                  <Text style={styles.dateRange}>{exp.duration}</Text>
                </View>
                {exp.experience.map((highlight, hIndex) => (
                  <View key={hIndex} style={styles.bulletItem} wrap={false}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletPoint}>{highlight}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={styles.sectionDivider} />
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={[styles.educationItem, index > 0 ? { marginTop: 8 } : {}]}>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.institution}>
                  {edu.school}  •  {edu.year}
                </Text>
              </View>
            ))}
            <View style={styles.sectionDivider} />
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
