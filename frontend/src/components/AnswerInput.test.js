import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnswerInput from "./AnswerInput";

describe("AnswerInput", () => {
  test("keeps typed answers editable in text mode", async () => {
    const onChange = jest.fn();

    render(
      <AnswerInput
        mode="text"
        value="hello"
        onChange={onChange}
        disabled={false}
      />
    );

    const field = screen.getByPlaceholderText("Your answer");
    expect(field).toHaveValue("hello");

    await userEvent.type(field, "!");
    expect(onChange).toHaveBeenCalled();
  });

  test("shows microphone controls in voice mode", () => {
    render(
      <AnswerInput
        mode="voice"
        value=""
        onChange={() => {}}
        disabled={false}
        isSupported
        isRecording={false}
        isStarting={false}
        elapsedSeconds={0}
        error={null}
        onStartRecording={() => {}}
        onStopRecording={() => {}}
        onRetryRecording={() => {}}
        onClear={() => {}}
      />
    );

    expect(screen.getByLabelText("Start recording")).toBeInTheDocument();
    expect(screen.getByText(/click the microphone and speak your answer/i)).toBeInTheDocument();
  });

  test("shows a permission error instead of breaking voice mode", () => {
    render(
      <AnswerInput
        mode="voice"
        value=""
        onChange={() => {}}
        disabled={false}
        isSupported
        isRecording={false}
        isStarting={false}
        elapsedSeconds={0}
        error="not-allowed"
        onStartRecording={() => {}}
        onStopRecording={() => {}}
        onRetryRecording={() => {}}
        onClear={() => {}}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/denied/i);
  });

  test("shows interim text separately from the finalized transcript", () => {
    render(
      <AnswerInput
        mode="voice"
        value="I use React and MongoDB"
        onChange={() => {}}
        disabled={false}
        isSupported
        isRecording
        isStarting={false}
        elapsedSeconds={12}
        interimTranscript="with Node.js"
        error={null}
        onStartRecording={() => {}}
        onStopRecording={() => {}}
        onRetryRecording={() => {}}
        onClear={() => {}}
      />
    );

    expect(screen.getByDisplayValue("I use React and MongoDB")).toBeInTheDocument();
    expect(screen.getByText("with Node.js")).toBeInTheDocument();
    expect(screen.getByText(/microphone active/i)).toBeInTheDocument();
  });
});
