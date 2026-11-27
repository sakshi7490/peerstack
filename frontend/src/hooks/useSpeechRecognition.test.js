import { getSpeechErrorMessage, isSpeechRecognitionSupported } from "./useSpeechRecognition";
import { DEFAULT_SPEECH_LANG } from "../utils/speechTranscript";

describe("speech recognition helpers", () => {
  test("explains permission denial clearly", () => {
    expect(getSpeechErrorMessage("not-allowed")).toMatch(/denied/i);
  });

  test("explains unsupported browsers clearly", () => {
    expect(getSpeechErrorMessage("unsupported")).toMatch(/not supported/i);
  });

  test("ignores aborted recognition", () => {
    expect(getSpeechErrorMessage("aborted")).toBeNull();
  });

  test("reports support from the browser API", () => {
    expect(typeof isSpeechRecognitionSupported()).toBe("boolean");
  });

  test("uses Indian English as the default recognition language", () => {
    expect(DEFAULT_SPEECH_LANG).toBe("en-IN");
  });
});
