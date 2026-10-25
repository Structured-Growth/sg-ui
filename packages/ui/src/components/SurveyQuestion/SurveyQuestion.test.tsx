// @vitest-environment jsdom
import {afterEach} from "vitest";
import {cleanup} from "@testing-library/react";
import {useState} from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {it, expect, vi} from "vitest";
import {SurveyQuestion, type SurveyAnswer} from "./SurveyQuestion";
it("requires at least one multi-choice answer and serializes selected IDs", async () => {
  function Example() {const [value, setValue] = useState<SurveyAnswer>(null); return <form aria-label="Answers"><SurveyQuestion id="channels" prompt="Channels" kind="multiple" required options={[{id:"sms",label:"SMS"},{id:"voice",label:"Voice"}]} value={value} onValueChange={setValue}/></form>;}
  render(<Example/>); const user = userEvent.setup(); const form = screen.getByRole("form") as HTMLFormElement;
  expect(form.checkValidity()).toBe(false);
  await user.click(screen.getByRole("checkbox", {name:"Voice"})); expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).getAll("channels")).toEqual(["voice"]);
});
it("keeps feedback separate from invalid errors and supports custom controls", () => {
  render(<SurveyQuestion id="custom" kind="custom" prompt="Your response" invalid errorMessage="Required" feedback={<p>Try another approach.</p>}><input aria-label="Custom response"/></SurveyQuestion>);
  expect(screen.getByRole("alert").textContent).toBe("Required"); expect(screen.getByText("Try another approach.")).toBeTruthy(); expect(screen.getByRole("textbox",{name:"Custom response"})).toBeTruthy();
});
it("does not accept changes to read-only answers", async () => {
  const change = vi.fn(); render(<SurveyQuestion id="q" prompt="Choice" options={[{id:"a",label:"A"},{id:"b",label:"B"}]} value="a" onValueChange={change} readOnly/>);
  await userEvent.setup().click(screen.getByRole("radio",{name:"B"})); expect(change).not.toHaveBeenCalled();
});

afterEach(cleanup);
