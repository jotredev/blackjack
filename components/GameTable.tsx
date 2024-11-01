"use client";

import { cn } from "@/lib/utils";

interface GameTableProps {
  children: React.ReactNode;
}

export default function GameTable({ children }: GameTableProps) {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="absolute inset-0">
        <div className="casino-table absolute inset-x-0 top-0 h-full">
          <div className="table-pattern absolute inset-0" />
          <div className="table-felt absolute inset-0" />
          <div className="table-edge absolute bottom-0 left-0 right-0 h-8" />
        </div>
      </div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}