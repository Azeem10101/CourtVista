import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lawyers, getInitials } from '../data/lawyers';
import './ChatList.css';

function getStoredMessages() {
    try {
        return JSON.parse(localStorage.getItem('courtvista_messages')) || [];
    } catch {
        return [];
    }
}

function getStoredConsultations() {
    try {
        return JSON.parse(localStorage.getItem('courtvista_consultations')) || [];
    } catch {
        return [];
    }
}

export default function ChatList() {
    const { user } = useAuth();
    const [messages] = useState(getStoredMessages);
    const [consultations] = useState(getStoredConsultations);

    // Build conversations from confirmed consultations
    const conversations = useMemo(() => {
        if (!user) return [];

        const isLawyer = user.role === 'lawyer';
        const platformProfile = isLawyer
            ? lawyers.find((l) => l.name.toLowerCase().includes(user.name.toLowerCase()))
            : null;

        // Get confirmed consultations for this user
        const myConsultations = consultations.filter((c) => {
            if (c.status !== 'confirmed') return false;
            if (isLawyer) {
                if (platformProfile && c.lawyerId === platformProfile.id) return true;
                return c.lawyerName?.toLowerCase().includes(user.name.toLowerCase());
            }
            if (c.clientUserId && c.clientUserId === user.id) return true;
            return c.clientEmail?.toLowerCase() === user.email?.toLowerCase();
        });

        // Build conversation objects
        return myConsultations.map((consultation) => {
            const conversationId = consultation.id;
            const convMessages = messages.filter((m) => m.conversationId === conversationId);
            const lastMessage = convMessages.length > 0
                ? convMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
                : null;
            const unreadCount = convMessages.filter(
                (m) => m.senderId !== user.id && !m.read
            ).length;

            const otherName = isLawyer ? consultation.clientName : consultation.lawyerName;
            const otherRole = isLawyer ? 'Client' : 'Lawyer';

            return {
                id: conversationId,
                otherName,
                otherRole,
                caseType: consultation.caseTypeName || 'Consultation',
                lastMessage: lastMessage?.text || 'No messages yet — start the conversation!',
                lastMessageTime: lastMessage?.timestamp || consultation.createdAt,
                unreadCount,
                lawyerId: consultation.lawyerId,
                isLawyer,
            };
        }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    }, [user, messages, consultations]);

    return (
        <div className="chat-list container animate-fade-in-up">
            <div className="chat-list__header">
                <h1 className="chat-list__title">💬 Messages</h1>
                <p className="chat-list__subtitle">
                    {user?.role === 'lawyer'
                        ? 'Communicate with your confirmed clients'
                        : 'Chat with your confirmed lawyers'}
                </p>
            </div>

            {conversations.length === 0 ? (
                <div className="chat-list__empty">
                    <div className="chat-list__empty-icon">💬</div>
                    <h3 className="chat-list__empty-title">No conversations yet</h3>
                    <p className="chat-list__empty-text">
                        {user?.role === 'lawyer'
                            ? 'Once you confirm a client consultation, you can chat with them here.'
                            : 'Once a lawyer confirms your consultation, you\'ll be able to chat with them here.'}
                    </p>
                    <Link to={user?.role === 'lawyer' ? '/dashboard/lawyer' : '/search'} className="btn btn--gold" style={{ marginTop: '1rem' }}>
                        {user?.role === 'lawyer' ? 'View Client Requests' : 'Find a Lawyer'}
                    </Link>
                </div>
            ) : (
                <div className="chat-list__conversations">
                    {conversations.map((conv) => {
                        const lawyerData = !conv.isLawyer
                            ? lawyers.find((l) => l.id === conv.lawyerId)
                            : null;

                        return (
                            <Link
                                key={conv.id}
                                to={`/messages/${conv.id}`}
                                className="chat-list__item"
                            >
                                <div className={`chat-list__avatar ${conv.isLawyer ? '' : 'chat-list__avatar--lawyer'}`}>
                                    {conv.isLawyer
                                        ? conv.otherName?.charAt(0)?.toUpperCase() || '?'
                                        : (lawyerData ? getInitials(lawyerData.name) : '⚖️')}
                                </div>
                                <div className="chat-list__info">
                                    <div className="chat-list__name-row">
                                        <span className="chat-list__name">{conv.otherName}</span>
                                        <span className="chat-list__role-tag">{conv.otherRole}</span>
                                    </div>
                                    <div className="chat-list__case">{conv.caseType}</div>
                                    <div className="chat-list__preview">{conv.lastMessage}</div>
                                </div>
                                <div className="chat-list__meta">
                                    <div className="chat-list__time">
                                        {new Date(conv.lastMessageTime).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <div className="chat-list__unread">{conv.unreadCount}</div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
