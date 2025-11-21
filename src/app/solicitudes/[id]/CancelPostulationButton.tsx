// src/app/solicitudes/[id]/CancelPostulationButton.tsx
"use client";

import { useActionState } from "react";
import { cancelApplication, type PostularState } from "../actions";

type Props = {
  requestId: string;
};

export default function CancelPostulationButton({ requestId }: Props) {
  const initialState: PostularState = { ok: false, message: "" };
  const [state, formAction] = useActionState(cancelApplication, initialState);

  return (
    <form action={formAction} className="mt-3">
      <input type="hidden" name="request_id" value={requestId} />

      <button
        type="submit"
        className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Salir de este turno
      </button>

      {state.message && (
        <p
          className={`mt-2 text-sm ${
            state.ok ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
