import { chatClient, streamClient } from "../config/stream.js";
import { ENV } from "../config/env.js";
import Session from "../models/Session.js";

const allowedDifficulties = ["Easy", "Medium", "Hard"];
const GROQ_PROBLEM_MODEL = "llama-3.3-70b-versatile";

const normalizeDifficulty = (difficulty = "") => {
  const normalized = difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1).toLowerCase();
  return allowedDifficulties.includes(normalized) ? normalized : "Medium";
};

const stripMarkdownFence = (value = "") =>
  value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

const ensureDetailedDescription = (problem, topic, difficulty) => {
  const minDescriptionLength = 220;
  const title = problem?.title || topic || "Custom Coding Problem";
  const safeDifficulty = normalizeDifficulty(difficulty || problem?.difficulty || "Medium");

  const fallbackDescription =
    `You are given a problem based on ${title}. Build a robust and efficient solution that works across edge cases and large inputs. ` +
    `Start by identifying the right data structure and approach for the ${safeDifficulty.toLowerCase()} difficulty level, then implement clean, testable logic. ` +
    `Your solution should return the expected output exactly as described and avoid unnecessary extra work, with clear attention to correctness and performance.`;

  let descriptionText = (problem?.description?.text || "").trim();
  if (!descriptionText || descriptionText.length < minDescriptionLength) {
    descriptionText = descriptionText
      ? `${descriptionText} ${fallbackDescription}`.trim()
      : fallbackDescription;
  }

  const notes = Array.isArray(problem?.description?.notes) ? [...problem.description.notes] : [];

  const defaultNotes = [
    "Explain the core algorithm and why it is correct.",
    "Handle edge cases such as empty/minimal inputs and boundary values.",
    "Mention expected time and space complexity of your approach.",
  ];

  const normalizedNotes = notes
    .map((note) => String(note || "").trim())
    .filter(Boolean);

  while (normalizedNotes.length < 3) {
    normalizedNotes.push(defaultNotes[normalizedNotes.length]);
  }

  return {
    ...problem,
    description: {
      text: descriptionText,
      notes: normalizedNotes,
    },
  };
};

const ensureExamplesAndConstraints = (problem) => {
  const examples = Array.isArray(problem?.examples) ? [...problem.examples] : [];
  const normalizedExamples = examples
    .map((example) => ({
      input: String(example?.input || "").trim(),
      output: String(example?.output || "").trim(),
      explanation: String(example?.explanation || "").trim(),
    }))
    .filter((example) => example.input && example.output);

  if (normalizedExamples.length && normalizedExamples.length < 2) {
    normalizedExamples.push({
      input: "Provide another valid input case",
      output: "Provide expected output",
      explanation: "Include a short reasoning for this output.",
    });
  }

  const constraints = Array.isArray(problem?.constraints)
    ? problem.constraints.map((value) => String(value || "").trim()).filter(Boolean)
    : [];

  const defaultConstraints = [
    "Input size can be large; design for efficiency.",
    "Avoid using brute-force when a better approach exists.",
    "Return output exactly in the required format.",
  ];

  const normalizedConstraints = [...constraints];
  for (const constraint of defaultConstraints) {
    if (normalizedConstraints.length >= 4) break;
    normalizedConstraints.push(constraint);
  }

  return {
    ...problem,
    examples: normalizedExamples,
    constraints: normalizedConstraints,
  };
};

const buildFallbackProblem = (topic, difficulty = "Medium") => {
  const title = topic?.trim() || "Custom Coding Problem";
  const safeDifficulty = normalizeDifficulty(difficulty);

  return {
    title,
    difficulty: safeDifficulty,
    category: "Algorithmic Thinking",
    description: {
      text: `Design and implement a function for: ${title}.`,
      notes: [
        "Return an efficient solution.",
        "Explain time and space complexity.",
      ],
    },
    examples: [
      {
        input: "input = [example]",
        output: "expectedOutput",
        explanation: "Provide logic to transform input into expectedOutput.",
      },
    ],
    constraints: ["1 ≤ n ≤ 10^5", "Optimize for time complexity"],
    starterCode: {
      javascript: `function solve(input) {\n  // Write your solution\n}\n\nconsole.log(solve([1,2,3]));`,
      python: `def solve(input):\n    # Write your solution\n    pass\n\nprint(solve([1,2,3]))`,
      java: `class Solution {\n    public static String solve(int[] input) {\n        // Write your solution\n        return \"\";\n    }\n\n    public static void main(String[] args) {\n        System.out.println(solve(new int[]{1,2,3}));\n    }\n}`,
    },
    expectedOutput: {
      javascript: "expectedOutput",
      python: "expectedOutput",
      java: "expectedOutput",
    },
  };
};

const sanitizeGeneratedProblem = (problem, topic, difficulty) => {
  const fallback = buildFallbackProblem(topic, difficulty);
  const safeDifficulty = normalizeDifficulty(problem?.difficulty || difficulty || fallback.difficulty);

  const baseProblem = {
    title: problem?.title || fallback.title,
    difficulty: safeDifficulty,
    category: problem?.category || fallback.category,
    description: {
      text: problem?.description?.text || fallback.description.text,
      notes: Array.isArray(problem?.description?.notes) ? problem.description.notes : fallback.description.notes,
    },
    examples: Array.isArray(problem?.examples) && problem.examples.length ? problem.examples : fallback.examples,
    constraints: Array.isArray(problem?.constraints) && problem.constraints.length ? problem.constraints : fallback.constraints,
    starterCode: {
      javascript: problem?.starterCode?.javascript || fallback.starterCode.javascript,
      python: problem?.starterCode?.python || fallback.starterCode.python,
      java: problem?.starterCode?.java || fallback.starterCode.java,
    },
    expectedOutput: {
      javascript: problem?.expectedOutput?.javascript || fallback.expectedOutput.javascript,
      python: problem?.expectedOutput?.python || fallback.expectedOutput.python,
      java: problem?.expectedOutput?.java || fallback.expectedOutput.java,
    },
  };

  const withDetails = ensureDetailedDescription(baseProblem, topic, safeDifficulty);
  return ensureExamplesAndConstraints(withDetails);
};

const fetchGeneratedProblem = async (topic, difficulty) => {
  if (!ENV.GROQ_API_KEY) {
    return buildFallbackProblem(topic, difficulty);
  }

  const prompt = `Generate one coding interview problem as strict JSON only (no markdown).\n\nTopic: ${topic}\nPreferred difficulty: ${difficulty || "Medium"}\n\nRequired JSON shape:\n{\n  "title": "string",\n  "difficulty": "Easy|Medium|Hard",\n  "category": "string",\n  "description": { "text": "string", "notes": ["string"] },\n  "examples": [{ "input": "string", "output": "string", "explanation": "string" }],\n  "constraints": ["string"],\n  "starterCode": { "javascript": "string", "python": "string", "java": "string" },\n  "expectedOutput": { "javascript": "string", "python": "string", "java": "string" }\n}\n\nQuality Rules:\n- description.text must be detailed (at least 120 words) with context, objective, and expected behavior.\n- description.notes must include at least 3 informative bullets (approach guidance, edge cases, complexity).\n- Provide at least 2 realistic examples, each with clear explanation.\n- Provide at least 4 meaningful constraints.\n- Keep starterCode complete and compilable.\n- starterCode must be NON-INTERACTIVE (no stdin, no prompts, no Scanner/System.in, no input(), no readline()).\n- starterCode must include built-in test calls (console.log / print / System.out.println) so it runs directly.\n- expectedOutput must exactly match what starterCode prints for each language.`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_PROBLEM_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You generate structured coding interview problems and must return valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
      }),
    }
  );

  if (!response.ok) {
    return buildFallbackProblem(topic, difficulty);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    return buildFallbackProblem(topic, difficulty);
  }

  try {
    const parsed = JSON.parse(stripMarkdownFence(rawText));
    return sanitizeGeneratedProblem(parsed, topic, difficulty);
  } catch {
    return buildFallbackProblem(topic, difficulty);
  }
};

export async function generateProblem(req, res) {
  try {
    const { topic, difficulty } = req.body;

    if (!topic?.trim()) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const generatedProblem = await fetchGeneratedProblem(topic.trim(), difficulty);
    res.status(200).json({ problem: generatedProblem });
  } catch (error) {
    console.log("Error in generateProblem controller:", error.message);
    res.status(500).json({ message: "Failed to generate problem" });
  }
}

export async function createSession(req, res) {
  try {
    const { problem, difficulty, customProblem } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const normalizedDifficulty = normalizeDifficulty(difficulty);

    if (!allowedDifficulties.includes(normalizedDifficulty)) {
      return res.status(400).json({ message: "Difficulty must be Easy, Medium, or Hard" });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = await Session.create({
      problem,
      difficulty: normalizedDifficulty,
      host: userId,
      callId,
      customProblem: customProblem || null,
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty: normalizedDifficulty, sessionId: session._id.toString() },
        settings_override: {
          recording: {
            mode: "disabled",
          },
        },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);

    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSession(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}