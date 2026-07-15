import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    MessageSquare,
    User,
    CalendarDays,
    Plus,
    Trash2,
    Loader2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import useQuestionStore from "../store/questionStore";
import useAuthStore from "../store/authStore";

const formatDate = (dateStr: string) => {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'Invalid date';
        return d.toLocaleDateString();
    } catch {
        return 'Invalid date';
    }
};

const QuestionsPage = () => {
    const { questions, isLoading, fetchQuestions, deleteQuestionById, deletingIds } = useQuestionStore();
    const { user } = useAuthStore();

    useEffect(() => {
        fetchQuestions();
    }, []);

    // 🔍 DEBUG: log user and questions when they change
    useEffect(() => {
        console.log('🔍 Current user:', user);
        console.log('🔍 Questions:', questions);
    }, [user, questions]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex justify-center items-center h-[75vh]">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400" />
            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Questions</h1>
                        <p className="mt-2 text-zinc-500">Explore discussions from the community.</p>
                    </div>
                    <Link
                        to="/ask"
                        className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-6 py-3 rounded-lg font-medium transition"
                    >
                        <Plus size={18} />
                        Ask Question
                    </Link>
                </div>

                {/* Search */}
                <div className="relative mb-10">
                    <Search size={18} className="absolute left-4 top-3.5 text-zinc-400" />
                    <input
                        placeholder="Search questions..."
                        className="w-full border border-zinc-200 rounded-xl pl-12 pr-4 py-3 bg-zinc-50 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition"
                    />
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-zinc-900">Latest Questions</h2>
                        <p className="text-sm text-zinc-500 mt-1">
                            {questions.length} question{questions.length !== 1 && "s"}
                        </p>
                    </div>
                </div>

                {/* Empty */}
                {questions.length === 0 && (
                    <div className="border border-dashed border-zinc-300 rounded-2xl py-20 text-center">
                        <MessageSquare size={60} className="mx-auto text-zinc-300" />
                        <h3 className="mt-5 text-2xl font-semibold">No questions yet</h3>
                        <p className="mt-2 text-zinc-500">Be the first person to ask something.</p>
                        <Link
                            to="/ask"
                            className="inline-flex mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
                        >
                            Ask Question
                        </Link>
                    </div>
                )}

                {/* Question List */}
                <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden bg-white">
                    {questions.map((q) => {
                        const isDeleting = deletingIds.has(Number(q.id));
                        // 🔍 DEBUG: log the comparison for each question
                        const authorIdNumber = Number(q.author_id);
                        const isAuthor = user?.id === authorIdNumber;
                        console.log(`🔍 Question ${q.id}: author_id=${q.author_id} (${authorIdNumber}), user?.id=${user?.id}, isAuthor=${isAuthor}`);

                        return (
                            <div key={q.id} className="group relative block">
                                <Link
                                    to={`/questions/${q.id}`}
                                    className="group block hover:bg-zinc-50 transition"
                                >
                                    <div className="border-l-4 border-transparent group-hover:border-orange-500 px-8 py-7 transition-all">
                                        <div className="flex justify-between gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-semibold text-zinc-900 group-hover:text-orange-600 transition">
                                                    {q.title}
                                                </h3>
                                                <p className="mt-3 text-zinc-600 leading-7 line-clamp-2">
                                                    {q.body}
                                                </p>
                                            </div>
                                            <div className="hidden sm:flex flex-col items-center justify-center w-24 rounded-xl bg-zinc-100 group-hover:bg-orange-50 transition">
                                                <span className="text-3xl font-bold text-zinc-900 group-hover:text-orange-600">
                                                    {q.answer_count}
                                                </span>
                                                <span className="text-xs text-zinc-500">Answers</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-6">
                                            <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                <User size={15} />
                                                <span>{q.username}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                <CalendarDays size={15} />
                                                {formatDate(q.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* ✅ Delete button – now shows only if isAuthor is true */}
                                {isAuthor && (
                                    <button
                                        disabled={isDeleting}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Are you sure you want to delete this question?')) {
                                                deleteQuestionById(Number(q.id));
                                            }
                                        }}
                                        className={`absolute top-4 right-4 p-2 bg-white border border-gray-200 rounded-full shadow-sm transition ${isDeleting
                                                ? 'text-orange-500 cursor-not-allowed opacity-100'
                                                : 'text-gray-400 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100'
                                            }`}
                                        title="Delete question"
                                    >
                                        {isDeleting ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default QuestionsPage;