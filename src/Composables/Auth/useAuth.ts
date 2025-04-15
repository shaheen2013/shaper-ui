// src/composables/useSessionAuth.js
import { usePage } from "@inertiajs/vue3";
import localforage from "localforage";
import { onMounted, onUnmounted } from "vue";
import { route } from "ziggy-js";
import { Axios } from "../Fetchers/BaseAxios";
import { useApi } from "../Fetchers/useApi";
import { addSessionToUrl, decryptData, encryptData } from "./../../Utils/utils";

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "lensix",
});

export async function useAuth() {
  // Variables
  const auth_url = usePage().props.auth_url as string;
  const oauthUrl = usePage().props.lensix_oauth_redirect_url as string;
  const isLoggedIn = usePage().props.isLoggedIn as boolean;

  const logOutApi = useApi();
  onMounted(() => {
    init();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      init();
    }
  }

  async function init() {
    const shouldContinue = await initializeSession();
    clearUrlParams();
    if (!shouldContinue) return;
    await validateSession();
  }

  async function initializeSession() {
    let shouldContinue = true;
    const urlParams = new URLSearchParams(window.location.search);
    const lensix_web_session = urlParams.get("lensix_web_session");
    if (lensix_web_session) {
      console.log("new session got from url params");
      await setSession(lensix_web_session);
      if (urlParams.get("redirect") === "back") {
        console.log(urlParams.get("redirect"));
        window.location.href = oauthUrl;
        shouldContinue = false;
      }
    } else {
      const storedSession = await localforage.getItem("lensix_web_session");
      const origin = encodeURIComponent(getCurrentUrl());
      if (!storedSession) {
        redirectToGetSession(origin);
      }
    }

    return shouldContinue;
  }

  function clearUrlParams() {
    setTimeout(() => {
      const url = new URL(window.location.href);
      let params = new URLSearchParams(window.location.search);
      params.delete("lensix_web_session");
      params.delete("redirect");
      url.search = params.toString();
      window.history.replaceState({}, document.title, url.href);
    });
  }

  async function validateSession() {
    const encrypted_lensix_web_session: string =
      (await localforage.getItem("lensix_web_session")) ?? "";
    const lensix_web_session = await decryptData(encrypted_lensix_web_session);
    if (await isExpired()) {
      redirectToGetSession(getCurrentUrl());
      return;
    }

    Axios.post("/auth/validate/lensix-session", {
      lensix_web_session: lensix_web_session,
    })
      .then((res: any) => {
        if (!res.data.isValid) {
          console.log("session is not valid");
          redirectToGetSession(getCurrentUrl());
          return;
        }
        const authServerLoggedIn = res.data.isLoggedIn;
        if (authServerLoggedIn && !isLoggedIn) {
          console.log("auth server is logged in but client is not");
          addSessionToUrl(oauthUrl)
            .then((url) => {
              window.location.href = url;
              return;
            })
            .catch((err) => {
              console.log(err);
              return;
            });
        }
        if (!authServerLoggedIn && isLoggedIn) {
          logOutApi.callApi(route("logout"), "POST");
        }
        if (res.data.redirect) {
          window.location.href = res.data.redirect;
        }
      })
      .catch((err: any) => {
        if (err.response?.status === 419) {
          window.location.reload();
        }

        console.log(err);
        console.error("Session validation error:", err);
      });
  }

  function redirectToGetSession(origin: string) {
    const urlEncodedOrgin = encodeURIComponent(origin);
    const url = `${auth_url}/auth/get-session?origin=${urlEncodedOrgin}`;
    console.log("redirect to get session url ", url);
    window.location.href = url;
  }

  async function setSession(lensix_web_session: string) {
    const encrypted_lensix_web_session = await encryptData(lensix_web_session);
    await localforage.setItem(
      "lensix_web_session",
      encrypted_lensix_web_session,
    );
    let minutes = 60;
    const now = new Date();
    const expirationTime = new Date(now.getTime() + 1000 * 60 * minutes);
    await localforage.setItem("expires_at", expirationTime.toISOString());
    console.log("expires set");
  }

  async function isExpired() {
    const expiresAt: string = (await localforage.getItem("expires_at")) ?? "";
    const now = new Date();
    return now > new Date(expiresAt);
  }

  function getCurrentUrl(): string {
    const url = new URL(window.location.href);
    const currentUrl = `${url.protocol}//${url.host}${url.pathname}`;
    return currentUrl;
  }
}
