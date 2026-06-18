import React, { useState } from "react";

const units = [
  {
    id: 1,
    title: "Chapter 1 - Algorithm Foundations",
    notes: [
      "Introduction to Algorithms",
      "Characteristics of Algorithms",
      "Time Complexity",
      "Space Complexity",
      "Asymptotic Notations",
      "Binary Search",
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
      "Strassen Matrix Multiplication",
    ],
  },
];

export default function RGPVNotes() {
  const [selectedUnit, setSelectedUnit] = useState(units[0]);
  const [selectedTopic, setSelectedTopic] = useState(
    units[0].notes[0]
  );

  return (
    <div className="min-h-screen bg-[#07130D] text-white flex">
      
      {/* SIDEBAR */}
      <div className="w-[300px] bg-[#0B1F17] border-r border-green-900 p-5">
        
        <h1 className="text-3xl font-bold text-[#00FF9C] mb-8">
          RGPV ADA
        </h1>

        <div className="space-y-4">
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnit(unit)}
              className="w-full text-left bg-[#10281E] hover:bg-[#153528] transition-all duration-300 p-4 rounded-2xl border border-green-800"
            >
              <h2 className="text-lg font-semibold text-[#7CFFCB]">
                {unit.title}
              </h2>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 overflow-y-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-[#00FF9C]">
            {selectedUnit.title}
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Real RGPV Notes • Analysis & Design of Algorithms
          </p>
        </div>

        {/* TOPIC GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {selectedUnit.notes.map((topic, index) => (
            <div
              key={index}
              onClick={() => setSelectedTopic(topic)}
              className={`cursor-pointer rounded-3xl p-6 border transition-all duration-300 hover:scale-105
              
              ${
                selectedTopic === topic
                  ? "bg-[#00FF9C] text-black border-[#00FF9C]"
                  : "bg-[#0F1D17] border-green-900 hover:bg-[#13271E]"
              }
              `}
            >
              <h2 className="text-xl font-bold">
                {topic}
              </h2>

              <p className="mt-3 text-sm opacity-80">
                Open Notes
              </p>
            </div>
          ))}
        </div>

        {/* NOTES SECTION */}
        <div className="mt-14 bg-[#0F1D17] border border-green-900 rounded-3xl p-8">

          <h2 className="text-4xl font-bold text-[#00FF9C] mb-6">
            {selectedTopic}
          </h2>

          <div className="space-y-5 text-gray-300 leading-8 text-lg">

            <p>
              This section contains detailed RGPV notes for:
              <span className="text-[#00FF9C] font-semibold">
                {" "}
                {selectedTopic}
              </span>
            </p>

            <p>
              Here you will add:
            </p>

            <ul className="list-disc ml-6 space-y-3">
              <li>Theory</li>
              <li>Definition</li>
              <li>Algorithm</li>
              <li>Examples</li>
              <li>Complexity Analysis</li>
              <li>C++ Code</li>
              <li>Output</li>
              <li>RGPV PYQs</li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}