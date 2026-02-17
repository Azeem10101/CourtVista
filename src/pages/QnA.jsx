import { useState } from 'react';
import { Link } from 'react-router-dom';
import { qnaData, lawyers, practiceAreas, getInitials } from '../data/lawyers';
import './QnA.css';

export default function QnA() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [questionCategory, setQuestionCategory] = useState('');
    const [showSubmitted, setShowSubmitted] = useState(false);

    const filteredQuestions = selectedCategory
        ? qnaData.filter((q) => q.category === selectedCategory)
        : qnaData;

    const handleAsk = (e) => {
        e.preventDefault();
        if (!questionText.trim()) return;
        setShowSubmitted(true);
        setQuestionText('');
        setQuestionCategory('');
        setTimeout(() => setShowSubmitted(false), 4000);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getCategoryName = (catId) => {
        return practiceAreas.find((pa) => pa.id === catId)?.name || catId;
    };

    const getCategoryIcon = (catId) => {
        return practiceAreas.find((pa) => pa.id === catId)?.icon || '❓';
    };

    const getLawyer = (lawyerId) => lawyers.find((l) => l.id === lawyerId);

    return (
        <div className="qna-page container">
            <div className="qna-page__header">
                <h1 className="qna-page__title">Legal Q&A</h1>
                <p className="qna-page__subtitle">
                    Get answers to your legal questions from verified lawyers
                </p>
            </div>

            <div className="qna-page__layout">
                <div>
                    {/* Ask Form */}
                    <form className="qna-ask-form" onSubmit={handleAsk}>
                        <h3 className="qna-ask-form__title">Ask a Legal Question</h3>
                        {showSubmitted && (
                            <div className="qna-submitted">
                                ✓ Your question has been submitted! Lawyers will respond soon.
                            </div>
                        )}
                        <div className="qna-ask-form__row">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Type your legal question here..."
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                            <select
                                className="form-select"
                                value={questionCategory}
                                onChange={(e) => setQuestionCategory(e.target.value)}
                            >
                                <option value="">Category</option>
                                {practiceAreas.map((pa) => (
                                    <option key={pa.id} value={pa.id}>{pa.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn--primary btn--sm">
                            Submit Question
                        </button>
                    </form>

                    {/* Questions List */}
                    <div className="qna-question-list">
                        {filteredQuestions.map((q) => (
                            <div key={q.id} className="qna-question animate-fade-in-up">
                                <div className="qna-question__header" onClick={() => toggleExpand(q.id)}>
                                    <div className="qna-question__icon">Q</div>
                                    <div>
                                        <div className="qna-question__title">{q.question}</div>
                                        <div className="qna-question__meta">
                                            <span className="chip">{getCategoryIcon(q.category)} {getCategoryName(q.category)}</span>
                                            <span>Asked by {q.askedBy}</span>
                                            <span>{q.date}</span>
                                            <span>{q.answers.length} answer{q.answers.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>

                                {expandedId === q.id && (
                                    <div className="qna-question__answers">
                                        {q.answers.map((ans) => {
                                            const ansLawyer = getLawyer(ans.lawyerId);
                                            return (
                                                <div key={ans.id} className="qna-answer">
                                                    <div className="qna-answer__header">
                                                        <div className="qna-answer__avatar">
                                                            {ansLawyer ? getInitials(ansLawyer.name) : 'A'}
                                                        </div>
                                                        <div>
                                                            <Link
                                                                to={`/lawyer/${ans.lawyerId}`}
                                                                className="qna-answer__lawyer-name"
                                                            >
                                                                {ansLawyer?.name || 'Anonymous Lawyer'}
                                                            </Link>
                                                            <div className="qna-answer__date">{ans.date}</div>
                                                        </div>
                                                    </div>
                                                    <p className="qna-answer__text">{ans.text}</p>
                                                    <div className="qna-answer__helpful">
                                                        👍 {ans.helpful} people found this helpful
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="qna-categories">
                        <h3 className="qna-categories__title">Categories</h3>
                        <div className="qna-categories__list">
                            <button
                                className={`qna-category-btn ${!selectedCategory ? 'qna-category-btn--active' : ''}`}
                                onClick={() => setSelectedCategory('')}
                            >
                                📋 All Questions
                            </button>
                            {practiceAreas
                                .filter((pa) => qnaData.some((q) => q.category === pa.id))
                                .map((pa) => (
                                    <button
                                        key={pa.id}
                                        className={`qna-category-btn ${selectedCategory === pa.id ? 'qna-category-btn--active' : ''}`}
                                        onClick={() => setSelectedCategory(pa.id)}
                                    >
                                        {pa.icon} {pa.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
