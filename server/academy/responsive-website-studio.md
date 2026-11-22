# Responsive Website Studio
RizQara Tech Academy · Beginner · 3 lessons and a build exercise

## Project brief
Build a one-page website for a fictional bike repair shop. A customer should be able to understand the services, see how to reach the shop, and request a repair. Work with sample content and a placeholder address. Aim for a usable first version in 90 minutes.

## Lesson 1 — Structure the page
Use a header with a link to the main content, a main landmark, and a footer. Put a single H1 above the main offer. A section heading should describe what the section contains, for example “Repair services” or “Request a repair.” Use links to navigate and buttons for actions.

Exercise: sketch the page in document order. Write the link text “Request a repair” and decide where it should lead. Add a real label for each field in the request form.

## Lesson 2 — Build a flexible layout
Start with one column. Let cards expand into more columns when there is room. Keep reading lines short and make images resize with their parent.

```css
.wrapper {
  width: min(100% - 2rem, 68rem);
  margin-inline: auto;
}
.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}
img {
  max-width: 100%;
  height: auto;
}
a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 3px solid #734428;
  outline-offset: 3px;
}
```

Exercise: add three service cards. Test with the longest service name at 320 px, 768 px, and 1280 px. Fix any horizontal scrolling at the card or field that causes it.

## Lesson 3 — Test the main task
Tab through the page. Confirm you can reach the repair link and understand where focus is. Submit the form with a missing email, then with a sample value. If you build only the frontend, show a clear demo state and make submission behavior explicit.

## Review rubric
- Structure: the heading order is understandable and form fields have visible labels.
- Layout: no horizontal overflow at the three test widths.
- Task: a visitor can identify a service and reach the request form.
- Feedback: the form explains which field needs attention.
- Evidence: save a narrow and wide screenshot and a list of issues you fixed.

## Check your understanding
1. Why use a link for “Request a repair” when it jumps to a section?
2. How would you find the element causing horizontal scrolling?
3. Which test can catch a missing focus indicator?

Suggested answers: the link navigates to a location; inspect element widths against the viewport; tab through the page with the keyboard.
