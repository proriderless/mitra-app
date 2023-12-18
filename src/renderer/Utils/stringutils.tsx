import React from "react";

export function isNullOrUndefinedOrEmptyString(s: string) {
  return !!s === false;
}

export function isNullOrUndefinedOrEmptyObject(s: any): boolean {
  return s
    ? Object.keys(s).length === 0 && s.constructor === Object
    : isNullOrUndefinedOrEmptyObject(s);
}

export function formatDuration(value: number | undefined) {
  if (value !== (undefined && null)) {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.round(value - minute * 60);

    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  } else {
    return `00:00:00`
  }
} 