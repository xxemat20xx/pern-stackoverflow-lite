import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    MessageSquare,
    User,
    CalendarDays,
    Plus,
} from "lucide-react";

import Navbar from "../components/Navbar";
import useQuestionStore from "../store/questionStore";

const QuestionsPage = () => {
    const { questions, isLoading, fetchQuestions } = useQuestionStore();

    useEffect(() => {
        fetchQuestions();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="flex justify-center items-center h-[75vh]">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* Hero */}

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white mb-10">

                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">

                        <div>

                            <h1 className="text-4xl font-bold">
                                Community Questions
                            </h1>

                            <p className="mt-3 text-blue-100 text-lg max-w-xl">
                                Browse discussions, share knowledge, and help others solve
                                problems together.
                            </p>

                        </div>

                        <Link
                            to="/ask"
                            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition"
                        >
                            <Plus size={18} />
                            Ask Question
                        </Link>

                    </div>

                </div>

                {/* Search */}

                <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-8">

                    <div className="relative">

                        <Search
                            className="absolute left-4 top-3.5 text-gray-400"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                        />

                    </div>

                </div>

                {/* Stats */}

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h2 className="text-xl font-semibold text-gray-900">
                            Latest Questions
                        </h2>

                        <p className="text-gray-500 mt-1">
                            {questions.length} question{questions.length !== 1 && "s"} available
                        </p>

                    </div>

                </div>

                {/* Empty */}

                {questions.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">

                        <MessageSquare
                            size={60}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-6 text-2xl font-semibold">
                            No questions yet
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Start the first discussion in your community.
                        </p>

                        <Link
                            to="/ask"
                            className="inline-flex mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                        >
                            Ask Question
                        </Link>

                    </div>
                )}

                {/* Cards */}

                <div className="space-y-5">

                    {questions.map((q) => (

                        <Link
                            key={q.id}
                            to={`/questions/${q.id}`}
                            className="block bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                        >

                            <div className="p-7">

                                <div className="flex justify-between items-start gap-6">

                                    <div className="flex-1">

                                        <h3 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition">
                                            {q.title}
                                        </h3>

                                        <p className="mt-4 text-gray-600 leading-7 line-clamp-3">
                                            {q.body}
                                        </p>

                                    </div>

                                    <div className="hidden sm:flex flex-col items-center bg-blue-50 rounded-2xl px-5 py-4 min-w-[90px]">

                                        <span className="text-3xl font-bold text-blue-700">
                                            {q.answer_count}
                                        </span>

                                        <span className="text-sm text-blue-600">
                                            Answers
                                        </span>

                                    </div>

                                </div>

                                <div className="mt-8 flex flex-wrap gap-4 items-center">

                                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">

                                        <User size={15} />

                                        <span>{q.username}</span>

                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500">

                                        <CalendarDays size={15} />

                                        {new Date(q.created_at).toLocaleDateString()}

                                    </div>

                                </div>

                            </div>

                        </Link>

                    ))}

                </div>

            </main>
        </div>
    );
};

export default QuestionsPage;