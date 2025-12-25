import ky from "ky";

export const apiClient = ky.create({
  prefixUrl: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ["get"],
  },
});
