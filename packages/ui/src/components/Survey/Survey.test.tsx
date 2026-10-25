// @vitest-environment jsdom
import {afterEach} from "vitest";
import {cleanup} from "@testing-library/react";
import {useState} from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, it, expect, vi} from "vitest";
import {Survey} from "./Survey";
import {SurveyQuestion, type SurveyAnswer} from "../SurveyQuestion/SurveyQuestion";
function Form({submit, mode = "one", allowBack = true}: {submit: () => void; mode?: "one" | "all"; allowBack?: boolean}) {
  const [answer, setAnswer] = useState<SurveyAnswer>(null);
  return <Survey title="Feedback" onSubmit={submit} mode={mode} allowBack={allowBack}>
    <SurveyQuestion id="first" prompt="Choose a channel" options={[{id: "text", label: "Text"}]} value={answer} onValueChange={setAnswer} required/>
    <SurveyQuestion id="second" prompt="Anything else?" kind="text"/>
  </Survey>;
}
describe("Survey", () => {
  it("gates Next, preserves answers on Back, and submits once", async () => {
    const user = userEvent.setup(); const submit = vi.fn();
    render(<Form submit={submit}/>);
    await user.click(screen.getByRole("button", {name: "Next"}));
    expect(screen.getByRole("group", {name: /Choose a channel/})).toBeTruthy();
    await user.click(screen.getByRole("radio", {name: "Text"}));
    await user.click(screen.getByRole("button", {name: "Next"}));
    expect(screen.getByRole("group", {name: "Anything else?"})).toBeTruthy();
    await user.click(screen.getByRole("button", {name: "Back"}));
    expect((screen.getByRole("radio", {name: "Text"}) as HTMLInputElement).checked).toBe(true);
    await user.click(screen.getByRole("button", {name: "Next"}));
    await user.click(screen.getByRole("button", {name: "Submit"}));
    expect(submit).toHaveBeenCalledTimes(1);
  });
  it("shows all questions and validates before submit", async () => {
    const submit = vi.fn(); const user = userEvent.setup();
    render(<Form mode="all" submit={submit}/>);
    expect(screen.getByRole("group", {name: "Anything else?"})).toBeTruthy();
    await user.click(screen.getByRole("button", {name: "Submit"})); expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole("radio", {name: "Text"}));
    await user.click(screen.getByRole("button", {name: "Submit"})); expect(submit).toHaveBeenCalledOnce();
  });
  it("keeps controlled navigation authoritative and hides Back when prohibited", async () => {
    const change = vi.fn(); const user = userEvent.setup();
    render(<Survey title="Controlled" currentQuestionId="a" onQuestionChange={change} onSubmit={vi.fn()} allowBack={false}>
      <SurveyQuestion id="a" prompt="First"/><SurveyQuestion id="b" prompt="Second"/>
    </Survey>);
    fireEvent.submit(screen.getByRole("form", {name: "Controlled"}));
    expect(change).toHaveBeenCalledWith("b"); expect(screen.queryByRole("button", {name: "Back"})).toBeNull();
    expect(screen.getByRole("group", {name: "First"})).toBeTruthy();
  });
});

afterEach(cleanup);
