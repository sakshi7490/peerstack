export const DEFAULT_SPEECH_LANG = "en-IN";

export function normalizeWhitespace(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

export function joinTranscriptParts(...parts) {
  return normalizeWhitespace(parts.filter(Boolean).join(" "));
}

export function readSpeechResults(results) {
  let finalText = "";
  let interimText = "";

  if (!results?.length) {
    return { finalText, interimText };
  }

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    const alternativeCount = result.length || 0;
    let best = result[0];

    for (let j = 1; j < alternativeCount; j += 1) {
      if ((result[j]?.confidence || 0) > (best?.confidence || 0)) {
        best = result[j];
      }
    }

    const transcript = best?.transcript || "";
    if (result.isFinal) {
      finalText += `${transcript} `;
    } else {
      interimText += `${transcript} `;
    }
  }

  return {
    finalText: normalizeWhitespace(finalText),
    interimText: normalizeWhitespace(interimText),
  };
}

const TECH_TERM_REPLACEMENTS = [
  [/\bnode\.?\s*js\b/gi, "Node.js"],
  [/\bnodejs\b/gi, "Node.js"],
  [/\bmongo\s*d\s*b\b/gi, "MongoDB"],
  [/\bmongodb\b/gi, "MongoDB"],
  [/\breact\.?\s*js\b/gi, "React"],
  [/\bjava script\b/gi, "JavaScript"],
  [/\btype script\b/gi, "TypeScript"],
  [/\bjay double u tee\b/gi, "JWT"],
  [/\bjwt\b/gi, "JWT"],
  [/\ba\s*p\s*i\b/gi, "API"],
  [/\bsql\b/gi, "SQL"],
  [/\bmachine learning\b/gi, "machine learning"],
  [/\boperating systems\b/gi, "operating systems"],
];

export function normalizeInterviewTranscript(text) {
  let next = text || "";

  TECH_TERM_REPLACEMENTS.forEach(([pattern, value]) => {
    next = next.replace(pattern, value);
  });

  return normalizeWhitespace(next);
}

export function snapshotSessionTranscript(finalized, sessionFinal) {
  return joinTranscriptParts(finalized, sessionFinal);
}
