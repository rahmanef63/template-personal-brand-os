// Personal Brand OS state reducer. Split out of `store.tsx` (LOC cap).
// Pure function over (State, Action) — no React dependency.

import { pagesReducer } from "@/features/_shared/pages/reducer";
import { landingReducer } from "@/features/_shared/landing/reducer";
import type { Action, State } from "./types";
import { SEED_STATE } from "./seed";

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      // Shallow-merge with SEED_STATE so any field added in a newer
      // schema (e.g. AB-wave landingSections) gets its default when
      // hydrating from an older localStorage payload.
      return { ...SEED_STATE, ...action.state };
    case "reset":
      return SEED_STATE;

    case "PAGE_CREATE":
    case "PAGE_UPDATE":
    case "PAGE_DELETE":
    case "PAGE_REORDER_BLOCK":
    case "PAGE_SECTION_UPSERT":
    case "PAGE_SECTION_DELETE": {
      const next = pagesReducer({ pages: state.pages }, action);
      return { ...state, pages: next.pages };
    }

    case "LANDING_UPSERT":
    case "LANDING_DELETE": {
      const next = landingReducer({ landingSections: state.landingSections }, action);
      return { ...state, landingSections: next.landingSections };
    }

    case "post.upsert": {
      const idx = state.posts.findIndex((p) => p.id === action.post.id);
      const posts =
        idx >= 0
          ? state.posts.map((p) => (p.id === action.post.id ? action.post : p))
          : [action.post, ...state.posts];
      return { ...state, posts };
    }
    case "post.delete":
      return { ...state, posts: state.posts.filter((p) => p.id !== action.id) };
    case "post.view":
      return {
        ...state,
        posts: state.posts.map((p) => (p.id === action.id ? { ...p, views: p.views + 1 } : p)),
      };

    case "portfolio.upsert": {
      const idx = state.portfolio.findIndex((p) => p.id === action.item.id);
      const portfolio =
        idx >= 0
          ? state.portfolio.map((p) => (p.id === action.item.id ? action.item : p))
          : [action.item, ...state.portfolio];
      return { ...state, portfolio };
    }
    case "portfolio.delete":
      return { ...state, portfolio: state.portfolio.filter((p) => p.id !== action.id) };

    case "service.upsert": {
      const idx = state.services.findIndex((s) => s.id === action.svc.id);
      const services =
        idx >= 0
          ? state.services.map((s) => (s.id === action.svc.id ? action.svc : s))
          : [...state.services, action.svc];
      return { ...state, services };
    }
    case "service.delete":
      return { ...state, services: state.services.filter((s) => s.id !== action.id) };

    case "resource.upsert": {
      const idx = state.resources.findIndex((r) => r.id === action.res.id);
      const resources =
        idx >= 0
          ? state.resources.map((r) => (r.id === action.res.id ? action.res : r))
          : [...state.resources, action.res];
      return { ...state, resources };
    }
    case "resource.delete":
      return { ...state, resources: state.resources.filter((r) => r.id !== action.id) };
    case "resource.download":
      return {
        ...state,
        resources: state.resources.map((r) =>
          r.id === action.id ? { ...r, downloads: r.downloads + 1 } : r,
        ),
      };

    case "lead.create":
      return { ...state, leads: [action.lead, ...state.leads] };
    case "lead.update":
      return {
        ...state,
        leads: state.leads.map((l) => (l.id === action.id ? { ...l, ...action.patch } : l)),
      };
    case "lead.delete":
      return { ...state, leads: state.leads.filter((l) => l.id !== action.id) };

    case "comment.create":
      return { ...state, comments: [action.comment, ...state.comments] };
    case "comment.upsert": {
      const idx = state.comments.findIndex((c) => c.id === action.comment.id);
      const comments =
        idx >= 0
          ? state.comments.map((c) => (c.id === action.comment.id ? action.comment : c))
          : [action.comment, ...state.comments];
      return { ...state, comments };
    }
    case "comment.moderate":
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id === action.id ? { ...c, status: action.status } : c,
        ),
      };
    case "comment.delete":
      return { ...state, comments: state.comments.filter((c) => c.id !== action.id) };

    case "subscriber.create":
      return { ...state, subscribers: [action.sub, ...state.subscribers] };
    case "subscriber.upsert": {
      const idx = state.subscribers.findIndex((s) => s.id === action.sub.id);
      const subscribers =
        idx >= 0
          ? state.subscribers.map((s) => (s.id === action.sub.id ? action.sub : s))
          : [action.sub, ...state.subscribers];
      return { ...state, subscribers };
    }
    case "subscriber.confirm":
      return {
        ...state,
        subscribers: state.subscribers.map((s) =>
          s.id === action.id ? { ...s, status: "confirmed" } : s,
        ),
      };
    case "subscriber.unsubscribe":
      return {
        ...state,
        subscribers: state.subscribers.map((s) =>
          s.id === action.id ? { ...s, status: "unsubscribed" } : s,
        ),
      };
    case "subscriber.delete":
      return { ...state, subscribers: state.subscribers.filter((s) => s.id !== action.id) };

    case "chat.session.start":
      return { ...state, chatSessions: [action.session, ...state.chatSessions] };
    case "chat.session.upsert": {
      const idx = state.chatSessions.findIndex((s) => s.id === action.session.id);
      const chatSessions =
        idx >= 0
          ? state.chatSessions.map((s) => (s.id === action.session.id ? action.session : s))
          : [action.session, ...state.chatSessions];
      return { ...state, chatSessions };
    }
    case "chat.session.delete":
      return { ...state, chatSessions: state.chatSessions.filter((s) => s.id !== action.id) };
    case "chat.message":
      return {
        ...state,
        chatSessions: state.chatSessions.map((s) =>
          s.id === action.sessionId
            ? {
                ...s,
                messages: [...s.messages, action.msg],
                flagged: action.flag ? true : s.flagged,
              }
            : s,
        ),
      };

    default:
      return state;
  }
}
