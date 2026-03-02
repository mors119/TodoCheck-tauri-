# Time-Based Habit Tracker

A minimal habit tracking application focused on **time-based progress**, not just task completion.

Instead of simply checking tasks as done, this project allows you to:

- schedule tasks on specific days of the week
- track how much time you spend on each task
- see daily progress against planned durations
- mark tasks as completed independently from time tracking

The goal is to create a **structured daily routine system** where both **completion** and **time investment** can be measured.

---

# Core Concept

Most habit trackers only track **whether a task was completed**.

This project tracks two different signals:

### 1️⃣ Completion

Did you finish the task today?

Example:

```
Read book
☑ Done
```

This is stored in the **Completion log**.

```
Completion
{
  taskId
  date
}
```

---

### 2️⃣ Time investment

How much time did you spend on the task?

Example:

```
Workout
45m / 60m
```

This is stored in **TimeEntry** records.

```
TimeEntry
{
  taskId
  date
  startedAt
  endedAt
  minutes
}
```

---

# Features

## Daily task scheduling

Each task can be scheduled on specific days of the week.

Example:

```
Monday, Wednesday, Friday
```

Only tasks scheduled for today appear in the **Today view**.

---

## Timer-based tracking

Tasks can be tracked with a built-in timer.

```
Start → Stop
```

The system records time entries automatically.

---

## Daily progress tracking

The application calculates:

```
spent time / planned time
```

Example:

```
2h 10m / 3h
```

A progress bar visualizes the overall progress of the day.

---

## Completion tracking

Tasks can be marked as **Done** independently from time tracking.

This allows workflows like:

```
Read book → Done
Workout → timer tracking
```

---

## Archive system

Tasks can be archived without deleting historical data.

Archived tasks:

- are hidden from the main task list
- can be restored later
- preserve completion and time logs

---

# Today Dashboard

The Today page provides a quick overview of the day:

- Scheduled tasks
- Completed tasks
- Completion rate
- Time progress
- Today's task list

This makes it easy to understand **how productive the day has been**.

---

# Data Model

The application uses a simple domain model.

### Task

```
Task
{
  id
  title
  category
  durationMinutes
  daysOfWeek
  isActive
}
```

---

### Completion

```
Completion
{
  taskId
  date
}
```

---

### TimeEntry

```
TimeEntry
{
  taskId
  date
  startedAt
  endedAt
  minutes
}
```

---

# UI Structure

```
Today Page
 ├─ Today summary
 │   ├─ Scheduled tasks
 │   ├─ Completed tasks
 │   └─ Completion progress
 │
 ├─ Time progress
 │   └─ daily planned vs spent time
 │
 └─ Task list
     ├─ Start / Stop timer
     ├─ Mark Done
     └─ Archive
```

---

# Design Philosophy

This project focuses on **clarity and simplicity**.

Principles:

- explicit domain models
- simple state structures
- predictable UI behavior
- minimal dependencies

The codebase is structured to keep **domain logic separated from UI components**.

```
domain/
 ├─ types
 ├─ completion
 ├─ schedule
 ├─ stats
 └─ date
```

---

# Tech Stack

Frontend:

- React
- TypeScript
- TailwindCSS

UI:

- Lucide icons

Architecture:

- Domain-driven structure
- Pure domain functions
- UI separated from logic

---

# Future Ideas

Possible improvements:

- weekly / monthly analytics
- streak tracking
- goal based progress
- habit consistency visualization
- cloud sync
- mobile layout improvements

---

# Why This Project Exists

Most productivity tools only track **task completion**.

But productivity is often better measured by **time invested**.

This project explores a hybrid model:

```
completion tracking
+
time tracking
```

This allows users to better understand how their time is actually spent.
