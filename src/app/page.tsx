"use client";

import { useState, useEffect } from "react";
import { FaRegCopy, FaSyncAlt } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";

export default function Home() {
  const [prompt, setPrompt] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastPrompt') || '';
    }
    return '';
  });
  const [provider, setProvider] = useState("gemini");
  const [model, setModel] = useState("gemini-1.5-flash");
  const [models, setModels] = useState<Record<string, string[]>>({});
  const [refinedPrompts, setRefinedPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('lastPrompt', prompt);
  }, [prompt]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch models");
        }
        setModels(data);
        if (data[provider] && data[provider].length > 0) {
          setModel(data[provider][0]);
        } else {
          // Set a default model based on the provider if no models are returned or available
          switch (provider) {
            case 'gemini':
              setModel('gemini-1.5-flash');
              break;
            case 'openai':
              setModel('gpt-4o');
              break;
            case 'claude':
              setModel('claude-3-opus-20240229');
              break;
            default:
              setModel('');
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch models:", err);
        if (err.message.includes("rate limit exceeded") || err.message.includes("quota")) {
          setError("API rate limit exceeded. Please try again later or check your API plan.");
        } else {
          setError(err.message);
        }
      }
    };

    fetchModels();
  }, [provider]); // Fetch models and set default model when provider changes

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRefinedPrompts([]);
    setCurrentPromptIndex(0);

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, provider, model }),
      });
    

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to refine prompt");
      }

      setRefinedPrompts(data.refinedPrompts);
      setError(null);
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("rate limit exceeded") || error.message.includes("quota")) {
        setError("API rate limit exceeded. Please try again later or check your API plan.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeeAnotherPrompt = () => {
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % refinedPrompts.length);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Your Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
              placeholder="Enter the prompt you want to refine..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="provider" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Select Provider
              </label>
              <select
                id="provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="gemini">Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
              </select>
            </div>
            <div>
              <label htmlFor="model" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Select Model
              </label>
              {console.log("Models state:", models, "Current provider models:", models[provider])}
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {models[provider]?.map((modelName) => (
                  <option key={modelName} value={modelName}>
                    {modelName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              disabled={isLoading}
            >
              <LuSparkles className="h-5 w-5 mr-2" />
              {isLoading ? "Refining..." : "Refine Prompt"}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {refinedPrompts.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Refined Prompt
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{refinedPrompts[currentPromptIndex]}</p>
            {refinedPrompts.length > 1 && (
              <div className="flex items-center justify-center mt-6">
                <button
                  onClick={() => navigator.clipboard.writeText(refinedPrompts[currentPromptIndex])}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4 flex items-center"
                >
                  <FaRegCopy className="h-5 w-5 mr-2" />
                  Copy to Clipboard
                </button>
                <button
                  onClick={handleSeeAnotherPrompt}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                >
                  <FaSyncAlt className="h-5 w-5 mr-2" />
                  See another prompt
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}