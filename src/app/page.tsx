"use client";

import { useState } from "react";

export default function Home() {
  const [violationType, setViolationType] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [homeownerAddress, setHomeownerAddress] = useState("");
  const [dateOfViolation, setDateOfViolation] = useState("");
  const [specificDetails, setSpecificDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async () => {
    if (!violationType || !communityName || !homeownerAddress || !dateOfViolation) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setGeneratedLetter("");
    setIsLoading(true);
    setCopySuccess(false);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          violationType,
          communityName,
          homeownerAddress,
          dateOfViolation,
          specificDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate letter");
      }

      setGeneratedLetter(data.letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            HOA Violation Letter AI
          </h1>
          <p className="text-lg text-gray-600">
            Generate a professional, compliant, and neighbor-friendly violation notice in seconds.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div>
            {/* Step 1: Violation Type */}
            <div className="mb-6">
              <label
                htmlFor="violationType"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                1. Select Violation Type
              </label>
              <select
                id="violationType"
                value={violationType}
                onChange={(e) => setViolationType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select a violation type --</option>
                <option value="Lawn & Landscaping Maintenance">
                  Lawn & Landscaping Maintenance
                </option>
                <option value="Trash Can Storage">Trash Can Storage</option>
                <option value="Unauthorized Parking">Unauthorized Parking</option>
                <option value="Noise Complaint">Noise Complaint</option>
                <option value="Unapproved Architectural Changes">
                  Unapproved Architectural Changes
                </option>
                <option value="Pet Policy Violation">Pet Policy Violation</option>
              </select>
            </div>

            {/* Step 2: Fill in Details */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                2. Fill in Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="communityName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Community Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="communityName"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    placeholder="e.g., Oakwood Estates HOA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="homeownerAddress"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Homeowner's Full Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="homeownerAddress"
                    value={homeownerAddress}
                    onChange={(e) => setHomeownerAddress(e.target.value)}
                    placeholder="e.g., 123 Main Street, City, State 12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dateOfViolation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfViolation"
                    value={dateOfViolation}
                    onChange={(e) => setDateOfViolation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="specificDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    (Optional) Additional Details
                  </label>
                  <textarea
                    id="specificDetails"
                    value={specificDetails}
                    onChange={(e) => setSpecificDetails(e.target.value)}
                    rows={4}
                    placeholder="Provide any additional context or specific observations..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Generating Your Letter..." : "Generate Your Letter"}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Generated Letter Display */}
        {generatedLetter && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Generated Letter
              </h2>
              <button
                onClick={handleCopyToClipboard}
                className="bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                {copySuccess ? "✓ Copied!" : "Copy to Clipboard"}
              </button>
            </div>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 bg-gray-50 p-6 rounded-md border border-gray-200">
                {generatedLetter}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}