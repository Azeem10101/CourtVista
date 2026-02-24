import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lawyers, getInitials } from '../data/lawyers';
import './ChatWindow.css';

function getStoredMessages() {
    try {
        return JSON.parse(localStorage.getItem('courtvista_messages')) || [];
    } catch {
        return [];
    }
}

function saveMessage(msg) {
    const all = getStoredMessages();
    all.push(msg);
    localStorage.setItem('courtvista_messages', JSON.stringify(all));
    return all;
}

function getStoredConsultations() {
    try {
        return JSON.parse(localStorage.getItem('courtvista_consultations')) || [];
    } catch {
        return [];
    }
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDateSeparator(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ChatWindow() {
    const { conversationId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState(getStoredMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Find the consultation for this conversation
    const consultation = useMemo(() => {
        const consultations = getStoredConsultations();
        return consultations.find((c) => c.id === conversationId);
    }, [conversationId]);

    const isLawyer = user?.role === 'lawyer';
    const otherName = isLawyer ? consultation?.clientName : consultation?.lawyerName;
    const lawyerData = !isLawyer
        ? lawyers.find((l) => l.id === consultation?.lawyerId)
        : null;

    // Filter messages for this conversation
    const conversationMessages = useMemo(() =>
        messages
            .filter((m) => m.conversationId === conversationId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
        [messages, conversationId]
    );

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages.length]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = useCallback((e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !consultation) return;

        const msg = {
            id: 'msg-' + Date.now(),
            conversationId,
            senderId: user.id,
            senderName: user.name,
            senderRole: user.role,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
            read: false,
        };

        const updated = saveMessage(msg);
        setMessages(updated);
        setNewMessage('');
        inputRef.current?.focus();
    }, [newMessage, user, consultation, conversationId]);

    if (!consultation) {
        return (
            <div className="chat-window container animate-fade-in-up">
                <div className="chat-window__not-found">
                    <div className="chat-list__empty-icon">🔍</div>
                    <h3>Conversation not found</h3>
                    <p>This conversation may not exist or has been removed.</p>
                    <Link to="/messages" className="btn btn--gold" style={{ marginTop: '1rem' }}>
                        ← Back to Messages
                    </Link>
                </div>
            </div>
        );
    }

    // Group messages by date for separators
    let lastDateStr = '';

    return (
        <div className="chat-window container animate-fade-in-up">
            {/* Header */}
            <div className="chat-window__header">
                <button className="chat-window__back" onClick={() => navigate('/messages')}>
                    ←
                </button>
                <div className={`chat-window__avatar ${!isLawyer ? 'chat-window__avatar--lawyer' : ''}`}>
                    {isLawyer
                        ? otherName?.charAt(0)?.toUpperCase() || '?'
                        : (lawyerData ? getInitials(lawyerData.name) : '⚖️')}
                </div>
                <div className="chat-window__header-info">
                    <div className="chat-window__header-name">{otherName}</div>
                    <div className="chat-window__header-meta">
                        {consultation.caseTypeName || 'Consultation'} · {isLawyer ? 'Client' : 'Lawyer'}
                    </div>
                </div>
                {lawyerData && !isLawyer && (
                    <Link to={`/lawyer/${lawyerData.id}`} className="btn btn--outline btn--sm">
                        View Profile
                    </Link>
                )}
            </div>

            {/* Messages area */}
            <div className="chat-window__messages">
                {conversationMessages.length === 0 && (
                    <div className="chat-window__start-conversation">
                        <div className="chat-window__start-icon">👋</div>
                        <p>Start the conversation! Say hello to {otherName}.</p>
                    </div>
                )}

                {conversationMessages.map((msg) => {
                    const isMine = msg.senderId === user.id;
                    const currentDateStr = formatDateSeparator(msg.timestamp);
                    let showDateSeparator = false;
                    if (currentDateStr !== lastDateStr) {
                        showDateSeparator = true;
                        lastDateStr = currentDateStr;
                    }

                    return (
                        <div key={msg.id}>
                            {showDateSeparator && (
                                <div className="chat-window__date-separator">
                                    <span>{currentDateStr}</span>
                                </div>
                            )}
                            <div className={`chat-window__bubble-row ${isMine ? 'chat-window__bubble-row--mine' : ''}`}>
                                {!isMine && (
                                    <div className="chat-window__bubble-avatar">
                                        {msg.senderName?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                                <div className={`chat-window__bubble ${isMine ? 'chat-window__bubble--mine' : 'chat-window__bubble--theirs'}`}>
                                    {!isMine && (
                                        <div className="chat-window__bubble-sender">{msg.senderName}</div>
                                    )}
                                    <div className="chat-window__bubble-text">{msg.text}</div>
                                    <div className="chat-window__bubble-time">{formatTime(msg.timestamp)}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form className="chat-window__input-area" onSubmit={handleSend}>
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-window__input"
                    placeholder={`Message ${otherName}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="chat-window__send-btn"
                    disabled={!newMessage.trim()}
                >
                    Send →
                </button>
            </form>
        </div>
    );
}
