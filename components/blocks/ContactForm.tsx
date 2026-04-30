"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

type ContactFormBlockData = {
  heading?: string;
  subheading?: string;
  submitLabel?: string;
  successMessage?: string;
};

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const contactFieldStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    transition: "background-color 0.2s ease, border-color 0.2s ease",
    "& fieldset": {
      borderColor: "rgba(15, 23, 42, 0.14)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(15, 23, 42, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f59e0b",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#475569",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#f59e0b",
  },
  "& .MuiOutlinedInput-input": {
    color: "#0f172a",
    "&::placeholder": {
      color: "#64748b",
      opacity: 1,
    },
  },
  "& .MuiOutlinedInput-input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #ffffff inset",
    WebkitTextFillColor: "#0f172a",
    caretColor: "#0f172a",
    borderRadius: "inherit",
  },
  ".dark & .MuiOutlinedInput-root": {
    backgroundColor: "rgba(15, 23, 42, 0.78)",
  },
  ".dark & .MuiOutlinedInput-root fieldset": {
    borderColor: "rgba(148, 163, 184, 0.24)",
  },
  ".dark & .MuiOutlinedInput-root:hover fieldset": {
    borderColor: "rgba(251, 191, 36, 0.55)",
  },
  ".dark & .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "#fbbf24",
  },
  ".dark & .MuiInputLabel-root": {
    color: "#cbd5e1",
  },
  ".dark & .MuiInputLabel-root.Mui-focused": {
    color: "#fbbf24",
  },
  ".dark & .MuiOutlinedInput-input": {
    color: "#f8fafc",
  },
  ".dark & .MuiOutlinedInput-input::placeholder": {
    color: "#94a3b8",
    opacity: 1,
  },
  ".dark & .MuiOutlinedInput-input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #0f172a inset",
    WebkitTextFillColor: "#f8fafc",
    caretColor: "#f8fafc",
  },
};

export default function ContactForm({ data }: { data: ContactFormBlockData }) {
  const [formData, setFormData] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange =
    (field: keyof ContactFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        throw new Error(result?.error || "Could not send your message.");
      }

      setFormData(initialState);
      setFeedback({
        type: "success",
        message:
          data.successMessage ||
          "Your message has been sent successfully. We will get back to you soon.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not send your message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box className="mt-8 rounded-[28px] border border-black/10  from-white via-stone-50 to-amber-50 p-6 shadow-sm dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 md:p-8">
        <Box className="mb-6">
          <Typography
            variant="h4"
            className="font-bold! text-slate-900 dark:text-slate-100"
          >
            {/* {data.heading || "Contact Us"} */}
          </Typography>
          <Typography className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
            {data.subheading ||
              "Have a tip, partnership idea, or question for our editorial team? Send us a message and we will take it from there."}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2"
        >
          <TextField
            label="Full Name"
            value={formData.name}
            onChange={handleChange("name")}
            required
            fullWidth
            placeholder="Enter your full name"
            sx={contactFieldStyles}
          />
          <TextField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
            fullWidth
            placeholder="you@example.com"
            sx={contactFieldStyles}
          />
          <TextField
            label="Subject"
            value={formData.subject}
            onChange={handleChange("subject")}
            required
            fullWidth
            placeholder="What would you like to talk about?"
            sx={contactFieldStyles}
            className="md:col-span-2"
          />
          <TextField
            label="Message"
            value={formData.message}
            onChange={handleChange("message")}
            required
            fullWidth
            multiline
            minRows={6}
            placeholder="Share your message here..."
            sx={contactFieldStyles}
            className="md:col-span-2"
          />

          <Box className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              className="rounded-full! bg-slate-900! px-6! !py-3 text-white! hover:!bg-slate-800 dark:!bg-amber-400 dark:!text-slate-950 dark:hover:!bg-amber-300"
            >
              {isSubmitting ? "Sending..." : data.submitLabel || "Send Message"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={3000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setFeedback(null)}
          severity={feedback?.type || "success"}
          variant="filled"
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
