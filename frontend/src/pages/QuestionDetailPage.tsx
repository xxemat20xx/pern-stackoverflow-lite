import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CalendarDays, MessageSquare } from 'lucide-react';

import Navbar from '../components/Navbar';
import useQuestionStore from '../store/questionStore';
import useAnswerStore from '../store/answerStore';
import useAuthStore from '../store/authStore';

const QuestionDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const questionId = Number(id);

    const { currentQuestion, fetchQuestionById, isLoading: qLoading } = useQuestionStore();
    const { answers, fetchAnswers, createAnswer, isLoading: aLoading } = useAnswerStore();
    const { user } = useAuthStore();


    const [newAnswerBody, setNewAnswerBody] = useState('');

    useEffect(() => {
        if (questionId) {
            fetchQuestionById(questionId);
            fetchAnswers(questionId);
        }
    }, [questionId]);

    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAnswerBody.trim()) return;
        const result = await createAnswer(questionId, newAnswerBody, user?.username);
        if (result.success) {
            setNewAnswerBody('');
        } else {
            alert(result.error || 'Failed to post answer');
        }
    };

    if (qLoading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="text-center pt-20 text-gray-500">Question not found.</div>
            </div>
        );
    }

    // Guard: ensure answers is always an array
    const answersList = Array.isArray(answers) ? answers : [];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Back button */}
                <button
                    onClick={() => navigate('/questions')}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
                >
                    <ArrowLeft size={18} /> Back to questions
                </button>

                {/* Question Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900">{currentQuestion.title}</h1>

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <User size={16} /> {currentQuestion.username}
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarDays size={16} /> {new Date(currentQuestion.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="mt-6 text-gray-700 leading-7 whitespace-pre-line">
                        {currentQuestion.body}
                    </div>
                </div>

                {/* Answers List */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageSquare size={24} /> {answersList.length} Answers
                    </h2>

                    <div className="space-y-4">
                        {answersList.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
                                No answers yet. Be the first to help!
                            </div>
                        ) : (
                            answersList.map((ans) => (
                                <div key={ans.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <div className="text-gray-700 leading-7 whitespace-pre-line">{ans.body}</div>
                                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                        <span className="flex items-center gap-1"><User size={14} /> {ans.username || 'Unknown'}</span>
                                        <span className="flex items-center gap-1"><CalendarDays size={14} /> {new Date(ans.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Post Answer Form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Answer</h3>
                    <form onSubmit={handleSubmitAnswer}>
                        <textarea
                            rows={6}
                            value={newAnswerBody}
                            onChange={(e) => setNewAnswerBody(e.target.value)}
                            placeholder="Share your knowledge and help solve this problem..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                            required
                        />
                        <button
                            type="submit"
                            disabled={aLoading}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition shadow-sm"
                        >
                            {aLoading ? 'Posting...' : 'Post Your Answer'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default QuestionDetailPage;