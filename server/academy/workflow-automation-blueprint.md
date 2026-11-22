# Workflow Automation Blueprint
RizQara Tech Academy · Intermediate · 3 lessons and a process design exercise

## Project brief
Design a workflow for a small service business that handles incoming inquiries by email. Use fictional requests. Route routine requests to a shared queue and make exceptions visible to a person. The exercise can be completed with a spreadsheet or diagram.

## Lesson 1 — Map the current process
Draw the path from receipt to resolution. For each step, list the owner, input, output, and waiting time. Record how repeats are spotted and how staff know which person is responsible.

Exercise: model three inquiries: a complete new request, a repeat of the same request, and a request with a missing contact channel.

## Lesson 2 — Specify rules and safeguards
Write a decision table with conditions and actions:

| Condition | Action | Owner |
| --- | --- | --- |
| New request with required details | Create queue item | Intake system |
| Matching request ID already processed | Link to existing item | Intake system |
| Missing details or unclear match | Flag for manual review | Intake owner |
| Integration reports a temporary failure | Retry with the same request ID, then alert | Intake owner |

Use the source message ID as an idempotency key, so retrying the same event does not create another work item. Log event time, request ID, and outcome. Keep sensitive message contents out of operational logs unless the team has a need and defined access controls.

## Lesson 3 — Validate and estimate
Test each rule, including delivering the same event twice and simulating a timeout after a work item was created. Confirm that the retry finds the existing item and that exceptions can be handled manually. Document how to pause automation and fall back to the inbox.

Example estimate with hypothetical inputs: 120 inquiries/month × 3 minutes saved = 360 minutes. Subtract 60 minutes/month for review and maintenance. Expected net saving in this scenario is 5 hours/month. Measure actual time before and after a pilot to replace assumptions.

## Deliverables
- A one-page workflow map with responsibilities.
- A decision table and five test cases.
- An estimate with explicit assumptions and one measurable pilot goal.
- A short note on how to pause or roll back the automation.

## Check your understanding
Why can a timeout be followed by a duplicate record?
Suggested answer: a remote service may finish the write after the caller times out. A retry should reuse the original request ID and detect the existing record.
