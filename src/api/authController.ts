import type { Register } from "react-router-dom";
import type { Login } from "./authTypes";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "../config/axios.config";
import { queryClient } from "../config/queryClient.config";


async function register(data: Register) {
  const res = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Failed to create the user");
  }

  return res.json();
}

async function login(data: Login) {
  const res = await fetch("/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Failed to create the user");
  }

  return res.json();
}
