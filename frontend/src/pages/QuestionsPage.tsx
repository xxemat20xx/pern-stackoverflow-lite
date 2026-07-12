import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    CalendarDays,
    MessageSquare,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

import Navbar from '../components/Navbar';
import useQuestionStore from '../store/questionStore';
import useAnswerStore from '../store/answerStore';
import useAuthStore from '../store/authStore';
import useVoteStore from '../store/voteStore';
import api from '../api/axios';

const QuestionDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const questionId = Number(id);

    const { currentQuestion, fetchQuestionById, isLoading: qLoading } = useQuestionStore();
    const { answers, fetchAnswers, createAnswer, isLoading: aLoading } = useAnswerStore();
    const { user } = useAuthStore();
    const { getVoteCounts, castVote, removeVote } = useVoteStore();

    const [newAnswerBody, setNewAnswerBody] = useState('');

    const [questionVotes, setQuestionVotes] = useState({ upvotes: 0, downvotes: 0 });
    const [answerVotes, setAnswerVotes] = useState<Record<number, { upvotes: number, downvotes: number }>>({});
    const [userVotes, setUserVotes] = useState<Record<string, 1 | -1 | null>>({});

    const getUserVote = async (targetType: 'question' | 'answer', targetId: number) => {
        if (!user) return null;
        try {
            const res = await api.get<{ vote_type: 1 | -1 }>(`/votes/me/${targetType}/${targetId}`);
            return res.data?.vote_type || null;
        } catch {
            return null;
        }
    };

    const loadVotes = async () => {
        if (!currentQuestion) return;

        const qId = Number(currentQuestion.id);
        const qVotes = await getVoteCounts('question', qId);
        setQuestionVotes(qVotes);
        const qUserVote = await getUserVote('question', qId);
        setUserVotes(prev => ({ ...prev, [`question-${qId}`]: qUserVote }));

        const answersArray = Array.isArray(answers) ? answers : [];
        for (const ans of answersArray) {
            const aVotes = await getVoteCounts('answer', ans.id);
            setAnswerVotes(prev => ({ ...prev, [ans.id]: aVotes }));
            const aUserVote = await getUserVote('answer', ans.id);
            setUserVotes(prev => ({ ...prev, [`answer-${ans.id}`]: aUserVote }));
        }
    };

    useEffect(() => {
        if (questionId) {
            fetchQuestionById(questionId);
            fetchAnswers(questionId);
        }
    }, [questionId]);

    useEffect(() => {
        if (currentQuestion) {
            loadVotes();
        }
    }, [currentQuestion, answers]);

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

    const handleVote = async (targetType: 'question' | 'answer', targetId: number, voteType: 1 | -1) => {
        if (!user) {
            alert('Please login to vote.');
            return;
        }

        const key = `${targetType}-${targetId}`;
        const currentUserVote = userVotes[key];

        try {
            if (currentUserVote === voteType) {
                await removeVote(targetType, targetId);
                setUserVotes(prev => ({ ...prev, [key]: null }));
            } else {
                // Explicitly cast to 1 | -1 to satisfy TypeScript
                await castVote(targetType, targetId, voteType as 1 | -1);
                setUserVotes(prev => ({ ...prev, [key]: voteType }));
            }

            const newCounts = await getVoteCounts(targetType, targetId);
            if (targetType === 'question') {
                setQuestionVotes(newCounts);
            } else {
                setAnswerVotes(prev => ({ ...prev, [targetId]: newCounts }));
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to vote.');
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

    const answersList = Array.isArray(answers) ? answers : [];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">

                <button
                    onClick={() => navigate('/questions')}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
                >
                    <ArrowLeft size={18} /> Back to questions
                </button>

                {/* Question Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
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

                        <div className="flex flex-col items-center gap-1 ml-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <button
                                onClick={() => handleVote('question', Number(currentQuestion.id), 1)}
                                className={`p-1 rounded transition hover:bg-gray-200 ${userVotes[`question-${currentQuestion.id}`] === 1 ? 'text-green-600' : 'text-gray-400'}`}
                            >
                                <ArrowUp size={24} />
                            </button>
                            <span className="font-bold text-lg text-gray-700">
                                {questionVotes.upvotes - questionVotes.downvotes}
                            </span>
                            <button
                                onClick={() => handleVote('question', Number(currentQuestion.id), -1)}
                                className={`p-1 rounded transition hover:bg-gray-200 ${userVotes[`question-${currentQuestion.id}`] === -1 ? 'text-red-600' : 'text-gray-400'}`}
                            >
                                <ArrowDown size={24} />
                            </button>
                        </div>
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
                                <div key={ans.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex gap-6">
                                    <div className="flex flex-col items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => handleVote('answer', ans.id, 1)}
                                            className={`p-1 rounded transition hover:bg-gray-200 ${userVotes[`answer-${ans.id}`] === 1 ? 'text-green-600' : 'text-gray-400'}`}
                                        >
                                            <ArrowUp size={20} />
                                        </button>
                                        <span className="font-bold text-gray-700">
                                            {(answerVotes[ans.id]?.upvotes || 0) - (answerVotes[ans.id]?.downvotes || 0)}
                                        </span>
                                        <button
                                            onClick={() => handleVote('answer', ans.id, -1)}
                                            className={`p-1 rounded transition hover:bg-gray-200 ${userVotes[`answer-${ans.id}`] === -1 ? 'text-red-600' : 'text-gray-400'}`}
                                        >
                                            <ArrowDown size={20} />
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-gray-700 leading-7 whitespace-pre-line">{ans.body}</div>
                                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                            <span className="flex items-center gap-1"><User size={14} /> {ans.username || 'Unknown'}</span>
                                            <span className="flex items-center gap-1"><CalendarDays size={14} /> {new Date(ans.created_at).toLocaleDateString()}</span>
                                        </div>
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