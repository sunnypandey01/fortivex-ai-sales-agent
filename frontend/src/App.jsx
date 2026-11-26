
import ReactMarkdown from "react-markdown";
import { useState, useEffect, useRef } from "react";

import {
  Send,
  Bot,
  Sparkles,
  User,
  Users,
  UserCheck,
  UserPlus,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  Plus
} from "lucide-react";

import {
  sendMessageToAI,
  getLeads,
  getAppointments,
  createAppointment
} from "./services/api";

import "./App.css";

function App() {
  // Chat states
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Navigation
  const [activePage, setActivePage] = useState("chat");

  // Lead states
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState("");

  // Appointment states
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState("");
  const [appointmentSaving, setAppointmentSaving] = useState(false);
  const [appointmentMessage, setAppointmentMessage] = useState("");
  const [appointmentError, setAppointmentError] = useState("");

  const [appointmentForm, setAppointmentForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    purpose: ""
  });

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef(null);

  // Fetch leads
  const loadLeads = async () => {
    try {
      setLeadsLoading(true);
      setLeadsError("");

      const data = await getLeads();
      setLeads(data.leads || []);
    } catch (error) {
      setLeadsError(error.message);
    } finally {
      setLeadsLoading(false);
    }
  };

  // Fetch appointments
  const loadAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      setAppointmentsError("");

      const data = await getAppointments();
      setAppointments(data.appointments || []);
    } catch (error) {
      setAppointmentsError(error.message);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Load appointments whenever the page opens
  useEffect(() => {
    if (activePage === "appointments") {
      loadAppointments();
    }
  }, [activePage]);

  // Voice input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported. Please use Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript.trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Voice output
  const speakResponse = (text) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // Send message to AI
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim()
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessageToAI(updatedMessages);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: reply
        }
      ]);

      speakResponse(reply);

    } catch (error) {
      console.error("Chat error:", error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Unable to connect to AI. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle AI voice
  const toggleVoice = () => {
    if (voiceEnabled) {
      window.speechSynthesis?.cancel();
    }

    setVoiceEnabled((previous) => !previous);
  };

  // Handle appointment form inputs
  const handleAppointmentChange = (event) => {
    const { name, value } = event.target;

    setAppointmentForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Create appointment
  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();

    try {
      setAppointmentSaving(true);
      setAppointmentMessage("");
      setAppointmentError("");

      await createAppointment(appointmentForm);

      setAppointmentMessage("Appointment scheduled successfully!");

      setAppointmentForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        purpose: ""
      });

      await loadAppointments();

    } catch (error) {
      setAppointmentError(error.message);
    } finally {
      setAppointmentSaving(false);
    }
  };

  // Lead statistics
  const totalLeads = leads.length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.qualificationStatus === "qualified"
  ).length;

  const newLeads = leads.filter(
    (lead) => lead.qualificationStatus === "new"
  ).length;

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          <Sparkles size={25} />
          <h2>Fortivex AI</h2>
        </div>

        <div className="sidebar-menu">
          <p className="menu-label">WORKSPACE</p>

          <div
            className={`menu-item ${activePage === "chat" ? "active" : ""}`}
            onClick={() => setActivePage("chat")}
          >
            AI Sales Agent
          </div>

          <div
            className={`menu-item ${activePage === "leads" ? "active" : ""}`}
            onClick={() => {
              setActivePage("leads");
              loadLeads();
            }}
          >
            Lead Management
          </div>

          <div
            className={`menu-item ${
              activePage === "appointments" ? "active" : ""
            }`}
            onClick={() => setActivePage("appointments")}
          >
            Appointments
          </div>
        </div>

        <div className="sidebar-bottom">
          <span className="online-dot"></span>
          System Operational
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="topbar">

          <div>
            <h3>
              {activePage === "chat"
                ? "AI Sales Assistant"
                : activePage === "leads"
                ? "Lead Management"
                : "Appointments"}
            </h3>

            <p>Autonomous customer engagement platform</p>
          </div>

          <div className="agent-status">
            <span className="online-dot"></span>
            AI Agent Online
          </div>

        </header>

        {/* AI Chat Page */}
        {activePage === "chat" && (
          <section className="chat-section">

            <div className="chat-heading">

              <div className="bot-icon">
                <Bot size={30} />
              </div>

              <h2>Meet your AI Sales Agent</h2>

              <p>
                Engage customers, understand their needs,
                and discover new business opportunities.
              </p>

              <button
                className="voice-toggle"
                onClick={toggleVoice}
              >
                {voiceEnabled
                  ? <Volume2 size={17} />
                  : <VolumeX size={17} />}

                {voiceEnabled ? "Voice On" : "Voice Off"}
              </button>

            </div>

            <div className="messages">

              {messages.length === 0 && (
                <div className="welcome-message">
                  <Sparkles size={22} />

                  <h3>Start a conversation</h3>

                  <p>
                    Hello! I'm your Fortivex AI sales assistant.
                    How can I help your business today?
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-row ${message.role}`}
                >

                  <div className="message-icon">
                    {message.role === "assistant"
                      ? <Bot size={19} />
                      : <User size={19} />}
                  </div>

                  <div className="message-bubble">

                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>

                    {message.role === "assistant" && (
                      <button
                        className="replay-voice"
                        onClick={() => speakResponse(message.content)}
                        title="Read response aloud"
                      >
                        <Volume2 size={15} />
                        Listen
                      </button>
                    )}

                  </div>

                </div>
              ))}

              {loading && (
                <div className="message-row assistant">

                  <div className="message-icon">
                    <Bot size={19} />
                  </div>

                  <div className="message-bubble">
                    Thinking...
                  </div>

                </div>
              )}

            </div>

            {/* Chat Input */}
            <div className="chat-input">

              <button
                className={`mic-button ${isListening ? "listening" : ""}`}
                onClick={startListening}
                disabled={loading}
                title={isListening ? "Stop listening" : "Speak"}
              >
                {isListening
                  ? <MicOff size={20} />
                  : <Mic size={20} />}
              </button>

              <input
                type="text"
                placeholder={
                  isListening
                    ? "Listening... Speak now"
                    : "Ask your AI sales assistant..."
                }
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) =>
                  event.key === "Enter" && handleSend()
                }
              />

              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
              >
                <Send size={19} />
                Send
              </button>

            </div>

            <p className="footer-note">
              Powered by Fortivex AI · Intelligent Sales Automation
            </p>

          </section>
        )}

        {/* Lead Management Page */}
        {activePage === "leads" && (
          <section className="chat-section">

            <div className="chat-heading">
              <h2>Lead Management</h2>

              <p>
                Monitor and manage customers captured by your AI sales agent.
              </p>
            </div>

            <div className="lead-stats">

              <div className="lead-stat-card">
                <Users size={25} />
                <p>Total Leads</p>
                <h2>{totalLeads}</h2>
              </div>

              <div className="lead-stat-card">
                <UserCheck size={25} />
                <p>Qualified Leads</p>
                <h2>{qualifiedLeads}</h2>
              </div>

              <div className="lead-stat-card">
                <UserPlus size={25} />
                <p>New Leads</p>
                <h2>{newLeads}</h2>
              </div>

            </div>

            <div className="leads-header">

              <div>
                <h3>Customer Leads</h3>
                <p>Customers captured through AI conversations</p>
              </div>

              <button
                onClick={loadLeads}
                disabled={leadsLoading}
              >
                <RefreshCw size={16} />
                Refresh
              </button>

            </div>

            {leadsLoading && (
              <div className="lead-message">
                Loading customer leads...
              </div>
            )}

            {leadsError && (
              <div className="lead-message error">
                {leadsError}
              </div>
            )}

            {!leadsLoading && !leadsError && leads.length === 0 && (
              <div className="lead-message">
                No leads found. Start an AI conversation to capture customers.
              </div>
            )}

            {!leadsLoading && !leadsError && (
              <div className="lead-list">

                {leads.map((lead) => (
                  <div className="lead-card" key={lead._id}>

                    <div className="lead-card-header">

                      <div>
                        <h3>{lead.name}</h3>
                        <p>{lead.email || "No email provided"}</p>
                      </div>

                      <span
                        className={`lead-status ${lead.qualificationStatus}`}
                      >
                        {lead.qualificationStatus || "new"}
                      </span>

                    </div>

                    <div className="lead-details">

                      <p>
                        <strong>Phone:</strong>{" "}
                        {lead.phone || "Not provided"}
                      </p>

                      <p>
                        <strong>Requirements:</strong>{" "}
                        {lead.requirements || "Not provided"}
                      </p>

                      <p>
                        <strong>Summary:</strong>{" "}
                        {lead.conversationSummary || "No summary available"}
                      </p>

                      <p>
                        <strong>Created:</strong>{" "}
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleString()
                          : "Unknown"}
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

        {/* Appointments Page */}
        {activePage === "appointments" && (
          <section className="chat-section">

            <div className="chat-heading">
              <div className="bot-icon">
                <Calendar size={28} />
              </div>

              <h2>Appointment Management</h2>

              <p>
                Schedule and manage customer consultations.
              </p>
            </div>

            {/* Booking Form */}
            <div className="appointment-form-card">

              <h3>
                <Plus size={19} />
                Book New Appointment
              </h3>

              <form
                className="appointment-form"
                onSubmit={handleAppointmentSubmit}
              >

                <div className="appointment-form-grid">

                  <input
                    type="text"
                    name="name"
                    placeholder="Customer name *"
                    value={appointmentForm.name}
                    onChange={handleAppointmentChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={appointmentForm.email}
                    onChange={handleAppointmentChange}
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={appointmentForm.phone}
                    onChange={handleAppointmentChange}
                  />

                  <input
                    type="date"
                    name="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    value={appointmentForm.date}
                    onChange={handleAppointmentChange}
                    required
                  />

                  <input
                    type="time"
                    name="time"
                    value={appointmentForm.time}
                    onChange={handleAppointmentChange}
                    required
                  />

                  <input
                    type="text"
                    name="purpose"
                    placeholder="Appointment purpose"
                    value={appointmentForm.purpose}
                    onChange={handleAppointmentChange}
                  />

                </div>

                <button
                  type="submit"
                  disabled={appointmentSaving}
                >
                  <Calendar size={17} />
                  {appointmentSaving
                    ? "Saving..."
                    : "Schedule Appointment"}
                </button>

              </form>

              {appointmentMessage && (
                <p className="appointment-success">
                  {appointmentMessage}
                </p>
              )}

              {appointmentError && (
                <p className="appointment-error">
                  {appointmentError}
                </p>
              )}

            </div>

            {/* Appointment List */}
            <div className="appointments-header">

              <div>
                <h3>Scheduled Appointments</h3>
                <p>
                  Total appointments: {appointments.length}
                </p>
              </div>

              <button
                onClick={loadAppointments}
                disabled={appointmentsLoading}
              >
                <RefreshCw size={16} />
                Refresh
              </button>

            </div>

            {appointmentsLoading && (
              <div className="lead-message">
                Loading appointments...
              </div>
            )}

            {appointmentsError && (
              <div className="lead-message error">
                {appointmentsError}
              </div>
            )}

            {!appointmentsLoading &&
              !appointmentsError &&
              appointments.length === 0 && (
                <div className="lead-message">
                  No appointments found. Schedule your first appointment above.
                </div>
              )}

            {!appointmentsLoading && !appointmentsError && (
              <div className="appointment-list">

                {appointments.map((appointment) => (
                  <div
                    className="appointment-card"
                    key={appointment._id}
                  >

                    <div className="appointment-card-header">

                      <div>
                        <h3>{appointment.name}</h3>
                        <p>{appointment.email || "No email provided"}</p>
                      </div>

                      <span className={`appointment-status ${appointment.status}`}>
                        {appointment.status}
                      </span>

                    </div>

                    <div className="appointment-details">

                      <p>
                        <Clock size={15} />
                        {appointment.date} · {appointment.time}
                      </p>

                      <p>
                        <User size={15} />
                        {appointment.phone || "No phone provided"}
                      </p>

                      <p>
                        <Calendar size={15} />
                        {appointment.purpose || "General consultation"}
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

      </main>

    </div>
  );
}

export default App;
