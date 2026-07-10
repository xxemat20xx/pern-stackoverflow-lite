import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuestionStore from "../store/questionStore";
import Navbar from "../components/Navbar";

const AskQuestionPage = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const { createQuestion, isLoading } = useQuestionStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await createQuestion(title, body);

        if (result.success) {
            navigate("/questions");
        } else {
            alert(result.error || "Failed to post question");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9f9]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Ask a public question
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Get help from the community by asking a clear, detailed question.
                    </p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">

                    {/* Main Form */}
                    <div className="lg:col-span-3">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* Title Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="font-semibold text-lg text-gray-900">
                                    Title
                                </h2>

                                <p className="text-sm text-gray-500 mt-1 mb-4">
                                    Be specific and imagine you're asking another developer.
                                </p>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Why does React re-render my component twice?"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                                />

                                <div className="mt-2 text-right text-xs text-gray-400">
                                    {title.length} characters
                                </div>
                            </div>

                            {/* Body Card */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">

                                <h2 className="font-semibold text-lg text-gray-900">
                                    What are the details of your problem?
                                </h2>

                                <p className="text-sm text-gray-500 mt-1 mb-4">
                                    Introduce the problem and expand on what you put in the title.
                                    Include what you tried and what you expected to happen.
                                </p>

                                <textarea
                                    rows={14}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    required
                                    placeholder={`Example:

I'm trying to fetch data using React Query...

Expected:
• Data loads correctly

Actual:
• It keeps returning undefined

Here is my code:
`}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none font-mono text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                                />

                                <div className="mt-2 flex justify-between text-xs text-gray-400">
                                    <span>
                                        Markdown supported
                                    </span>

                                    <span>{body.length} characters</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4">

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-8 py-3 rounded-lg transition shadow-sm"
                                >
                                    {isLoading
                                        ? "Posting..."
                                        : "Post your question"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/questions")}
                                    className="border border-gray-300 bg-white hover:bg-gray-50 px-6 py-3 rounded-lg transition"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">

                            <h3 className="font-semibold text-gray-900 mb-4">
                                Writing a good question
                            </h3>

                            <div className="space-y-5 text-sm">

                                <div>
                                    <p className="font-medium text-gray-800">
                                        ✔ Summarize the problem
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        Write a specific title that explains exactly what you're
                                        trying to solve.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-800">
                                        ✔ Include details
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        Describe what you expected, what actually happened,
                                        and include any relevant code.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-800">
                                        ✔ Share what you've tried
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        Explain your research and attempted solutions to
                                        avoid duplicate answers.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-800">
                                        ✔ Make it reproducible
                                    </p>
                                    <p className="text-gray-500 mt-1">
                                        Include enough information so others can reproduce
                                        your issue.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default AskQuestionPage;