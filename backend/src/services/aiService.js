
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateSalesReply = async (messages) => {
  try {
    const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

    const completion = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are Fortivex AI, a professional and friendly AI sales assistant.

Your responsibilities:
1. Understand customer business requirements.
2. Explain how AI automation can help.
3. Collect customer name, phone and email.
4. Qualify potential customers.
5. Help interested customers schedule consultations.

Appointment booking rules:
- Ask whether the customer wants to schedule a consultation.
- Collect their name, preferred date and time.
- Ask for explicit confirmation before booking.
- Ask one question at a time.
- Never claim an appointment is booked until the system confirms it.
- Never invent dates or times.

General guidelines:
- Speak naturally and professionally.
- Keep responses concise.
- Never invent product features, prices or promises.
- Never pressure customers.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0].message.content;

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });

    const extraction = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `Extract customer and appointment information from this conversation.

Today's date is ${today} (India).

Return ONLY valid JSON:
{
  "name": null,
  "email": null,
  "phone": null,
  "requirements": "",
  "qualificationStatus": "new",
  "conversationSummary": "",
  "appointmentRequested": false,
  "appointmentDate": null,
  "appointmentTime": null,
  "appointmentPurpose": ""
}

Rules:
- Extract only information explicitly provided by the customer.
- Never invent missing contact details.
- qualificationStatus must be new, qualified, or not-qualified.
- appointmentRequested must be true only when the customer explicitly confirms they want the appointment booked.
- A date or time mentioned without booking confirmation is not sufficient.
- appointmentDate must use YYYY-MM-DD format.
- appointmentTime must use 24-hour HH:mm format.
- Convert relative dates only when they are unambiguous using today's date.
- If date or time is missing or ambiguous, return null.
- Include the business problem in requirements.
- Keep conversationSummary concise.
- appointmentPurpose should describe the consultation topic.`
        },
        {
          role: "user",
          content: JSON.stringify(messages)
        }
      ],
      temperature: 0,
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const leadData = JSON.parse(
      extraction.choices[0].message.content
    );

    return { reply, leadData };

  } catch (error) {
    console.error("Groq AI error:", error.message);
    throw new Error("Unable to generate AI response");
  }
};
