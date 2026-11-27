import {
  DEFAULT_SPEECH_LANG,
  joinTranscriptParts,
  normalizeInterviewTranscript,
  readSpeechResults,
  snapshotSessionTranscript,
} from "./speechTranscript";

function result(transcript, isFinal, confidence = 0.9) {
  const item = [{ transcript, confidence }];
  item.isFinal = isFinal;
  return item;
}

describe("speech transcript helpers", () => {
  test("defaults to Indian English", () => {
    expect(DEFAULT_SPEECH_LANG).toBe("en-IN");
  });

  test("rebuilds final and interim text from the full results list", () => {
    const first = readSpeechResults([
      result("I use React", true),
      result("and mongo", false),
    ]);
    expect(first.finalText).toBe("I use React");
    expect(first.interimText).toBe("and mongo");

    const next = readSpeechResults([
      result("I use React", true),
      result("and MongoDB", true),
      result("with Node", false),
    ]);
    expect(next.finalText).toBe("I use React and MongoDB");
    expect(next.interimText).toBe("with Node");
  });

  test("keeps earlier sentences when a later session is snapshotted", () => {
    const firstSession = "I would use JWT for authentication.";
    const secondSession = "I would store tokens securely.";
    expect(snapshotSessionTranscript(firstSession, secondSession)).toBe(
      "I would use JWT for authentication. I would store tokens securely."
    );
  });

  test("does not drop previous parts when joining paused speech", () => {
    expect(
      joinTranscriptParts("REST APIs in Node.js", "and SQL queries")
    ).toBe("REST APIs in Node.js and SQL queries");
  });

  test("normalizes common interview technical terms", () => {
    expect(
      normalizeInterviewTranscript("I use node js with mongo db and jwt api")
    ).toBe("I use Node.js with MongoDB and JWT API");
  });
});
