import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/cliente/mercados")({ component: () => <Outlet /> });
