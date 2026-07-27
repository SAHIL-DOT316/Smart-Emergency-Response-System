import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "How does the ambulance booking work?",
    answer:
      "The system finds the nearest available ambulance using GPS location and dispatches it instantly.",
  },
  {
    question: "Can I track the ambulance live?",
    answer:
      "Yes. Patients can track the ambulance in real time with live location updates and estimated arrival time.",
  },
  {
    question: "How are hospitals selected?",
    answer:
      "Nearby hospitals are displayed based on your location. Drivers can choose the most suitable hospital for the patient.",
  },
  {
    question: "What is Green Corridor?",
    answer:
      "Green Corridor is a future feature that aims to notify nearby vehicles and integrate with smart traffic signals to reduce ambulance travel time.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. User authentication, encrypted passwords, and secure APIs help protect personal information.",
  },
];

function FAQSection() {
  return (
    <Box
      sx={{
        py: 12,
        bgcolor: "#fff",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="#1565C0"
        >
          Frequently Asked Questions
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 6,
          }}
        >
          Find answers to the most common questions about our Smart Emergency
          Response System.
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              mb: 2,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 2,

              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}

export default FAQSection;