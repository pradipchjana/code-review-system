---- MAIN ----

```js
res: {
    model: "llama3.1",
    created_at: "2026-02-27T13:49:02.618437Z",
    message: {
      role: "assistant",
      content: "",
      tool_calls: [ { id: "call_bawb3zq3", function: [Object] } ]
    },
    done: true,
    done_reason: "stop",
    total_duration: 30317531012,
    load_duration: 7547091282,
    prompt_eval_count: 219,
    prompt_eval_duration: 18766158628,
    eval_count: 22,
    eval_duration: 3961863463
  }


"function": {
  "name": "adder",
  "description": "Adds two number",
  "parameters": {
    "type": "object",
    "required": ["a", "b"],
    "properties": {
      "a": {
        "type": "number",
        "description": "First number",
      },
      "b": {
        "type": "number",
        "description": "Second number",
      },
    },
  },
},
```
