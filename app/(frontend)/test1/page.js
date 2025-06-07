'use client'
import React from "react";

export default function Football() {
  const shoot = (message, event) => {
    alert(event); // Shows the event type (e.g., "click")
  }

  return (
    <button onClick={(event) => shoot("Goal!", event)}>Take the shot!</button>
  );
}


