const PUBLIC_INTERCOM_APP_ID = import.meta.env.PUBLIC_INTERCOM_APP_ID as string | undefined;

type IntercomCommand = "boot" | "show" | "showNewMessage";

declare global {
  interface Window {
    Intercom?: (command: IntercomCommand, payload?: Record<string, unknown> | string) => void;
    intercomSettings?: Record<string, unknown>;
  }
}

let booted = false;

export function bootIntercom() {
  if (booted || !PUBLIC_INTERCOM_APP_ID || typeof window === "undefined") return;

  window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: PUBLIC_INTERCOM_APP_ID,
  };

  const existing = document.getElementById("intercom-loader");
  if (!existing) {
    const s = document.createElement("script");
    s.id = "intercom-loader";
    s.async = true;
    s.src = `https://widget.intercom.io/widget/${PUBLIC_INTERCOM_APP_ID}`;
    document.head.appendChild(s);

    s.addEventListener("load", () => {
      window.Intercom?.("boot", window.intercomSettings);
    });
  } else {
    window.Intercom?.("boot", window.intercomSettings);
  }

  booted = true;
}

export function openIntercomNewMessage(message?: string) {
  if (typeof window === "undefined") return;
  bootIntercom();
  window.Intercom?.("showNewMessage", message ?? "");
}
