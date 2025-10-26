// src/app/solicitudes/[id]/PostularButton.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom"; // <- si lo usas para "isPending"
import { postularARequest, type PostularState } from "../actions";

type Props = {
  requestId: string;
  disabled?: boolean; // cuando no hay cupos, etc.
};

export default function PostularButton({ requestId, disabled }: Props) {
  const initialState = { ok: false, message: "" };
  const [state, formAction] = useActionState(postularARequest, initialState);

  return (
    <form action={formAction}>
      {/* Garantiza que la server action reciba el id */}
      <input type="hidden" name="request_id" value={requestId} />

      <SubmitButton disabled={disabled} />

      {/* Mensaje de respuesta */}
      {state.message && (
        <p
          className={`mt-2 text-sm ${
            state.ok ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="mt-4 inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
      disabled={disabled || pending}
    >
      {pending ? "Enviando…" : "Postular"}
    </button>
  );
}
